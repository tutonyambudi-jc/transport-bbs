# Documentation des API Routes

## Authentification

### POST `/api/auth/register`
Créer un nouveau compte utilisateur

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string (optionnel)",
  "password": "string"
}
```

### POST `/api/auth/[...nextauth]`
Authentification NextAuth (login/logout)

## Réservations

### POST `/api/bookings`
Créer une nouvelle réservation

**Body:**
```json
{
  "tripId": "string",
  "seatId": "string",
  "passengerName": "string",
  "passengerPhone": "string (optionnel)",
  "passengerEmail": "string (optionnel)"
}
```

**Response:**
```json
{
  "bookingId": "string",
  "ticketNumber": "string"
}
```

### POST `/api/bookings/[id]/payment`
Effectuer le paiement d'une réservation

**Body:**
```json
{
  "method": "MOBILE_MONEY" | "CARD" | "CASH"
}
```

## Trajets

### GET `/api/trips/search`
Rechercher des trajets

**Query Parameters:**
- `origin`: Ville de départ
- `destination`: Ville d'arrivée
- `date`: Date au format YYYY-MM-DD

**Response:**
```json
[
  {
    "id": "string",
    "departureTime": "datetime",
    "arrivalTime": "datetime",
    "price": "number",
    "availableSeats": "number",
    "bus": { ... },
    "route": { ... }
  }
]
```

## Fret

### POST `/api/freight`
Créer une commande de fret

**Body:**
```json
{
  "tripId": "string",
  "senderName": "string",
  "senderPhone": "string",
  "receiverName": "string",
  "receiverPhone": "string",
  "weight": "number",
  "type": "string (optionnel)",
  "value": "number (optionnel)",
  "notes": "string (optionnel)",
  "agentId": "string (optionnel)"
}
```

**Response:**
```json
{
  "freightOrderId": "string",
  "trackingCode": "string",
  "price": "number"
}
```

### GET `/api/freight`
Lister les commandes de fret

**Query Parameters:**
- `trackingCode`: Code de suivi (optionnel)

## Publicités

### GET `/api/advertisements`
Lister les publicités

**Query Parameters:**
- `type`: Type de bannière (BANNER_HOMEPAGE, BANNER_RESULTS, BANNER_CONFIRMATION)
- `status`: Statut (ACTIVE, INACTIVE, EXPIRED)

### POST `/api/advertisements`
Créer une publicité (Admin uniquement)

**Body:**
```json
{
  "advertiserId": "string",
  "title": "string",
  "description": "string (optionnel)",
  "imageUrl": "string",
  "linkUrl": "string (optionnel)",
  "type": "BANNER_HOMEPAGE" | "BANNER_RESULTS" | "BANNER_CONFIRMATION",
  "startDate": "datetime",
  "endDate": "datetime"
}
```

### GET `/api/advertisements/[id]`
Obtenir une publicité spécifique (incrémente les impressions)

### PUT `/api/advertisements/[id]`
Mettre à jour une publicité (Admin uniquement)

### DELETE `/api/advertisements/[id]`
Supprimer une publicité (Admin uniquement)

### POST `/api/advertisements/[id]/click`
Enregistrer un clic sur une publicité

## Notes

- Toutes les routes nécessitent une authentification sauf `/api/auth/*` et certaines routes publiques
- Les rôles sont vérifiés pour les routes administratives
- Les erreurs retournent un format JSON avec un champ `error`
