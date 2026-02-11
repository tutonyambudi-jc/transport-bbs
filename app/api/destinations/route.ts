import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function clampInt(value: string | null, fallback: number, min: number, max: number) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(min, Math.min(max, Math.floor(n)))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const take = clampInt(searchParams.get('take'), 6, 1, 24)
  const connectionsTake = clampInt(searchParams.get('connections'), 6, 1, 24)

  try {
    const now = new Date()

    const grouped = await prisma.trip.groupBy({
      by: ['routeId'],
      where: {
        isActive: true,
        departureTime: { gte: now },
        route: { isActive: true },
      },
      _count: { id: true },
      _min: { departureTime: true, price: true },
      orderBy: { _count: { id: 'desc' } },
      take: 200,
    })

    const routeIds = grouped.map((g) => g.routeId)
    if (routeIds.length === 0) {
      return NextResponse.json({ destinations: [] })
    }

    const routes = await prisma.route.findMany({
      where: { id: { in: routeIds }, isActive: true },
      select: { id: true, origin: true, destination: true },
    })

    const routeById = new Map(routes.map((r) => [r.id, r]))

    type Connection = {
      origin: string
      destination: string
      trips: number
      nextDepartureTime: string | null
      fromPrice: number | null
    }

    const connections: Connection[] = grouped
      .map((g) => {
        const r = routeById.get(g.routeId)
        if (!r) return null
        return {
          origin: r.origin,
          destination: r.destination,
          trips: g._count?.id ?? 0,
          nextDepartureTime: g._min?.departureTime ? new Date(g._min.departureTime).toISOString() : null,
          fromPrice: typeof g._min?.price === 'number' ? g._min.price : null,
        } satisfies Connection
      })
      .filter((x): x is Connection => Boolean(x))

    const byDestination = new Map<string, { destination: string; totalTrips: number; connections: Connection[] }>()
    for (const c of connections) {
      const key = c.destination
      const existing = byDestination.get(key)
      if (existing) {
        existing.totalTrips += c.trips
        existing.connections.push(c)
      } else {
        byDestination.set(key, { destination: key, totalTrips: c.trips, connections: [c] })
      }
    }

    const destinations = Array.from(byDestination.values())
      .sort((a, b) => b.totalTrips - a.totalTrips)
      .slice(0, take)
      .map((d) => ({
        destination: d.destination,
        totalTrips: d.totalTrips,
        connections: d.connections
          .sort((a, b) => b.trips - a.trips)
          .slice(0, connectionsTake),
      }))

    return NextResponse.json({ destinations })
  } catch (error) {
    // Important: keep the frontend stable even if DB is not configured locally.
    console.error('Destinations error:', error)
    return NextResponse.json(
      {
        destinations: [],
        error: `Erreur technique (${error instanceof Error ? error.message : 'Inconnue'})`,
      },
      { status: 200 }
    )
  }
}
