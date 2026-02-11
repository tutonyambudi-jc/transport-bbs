# Script de configuration rapide de la base de données
# Usage: .\setup-db.ps1

Write-Host "🔧 Configuration de la base de données Aigle Royale" -ForegroundColor Cyan
Write-Host ""

# Vérifier que .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Fichier .env introuvable" -ForegroundColor Red
    exit 1
}

# Lire le DATABASE_URL actuel
$currentUrl = Get-Content .env | Select-String "DATABASE_URL" | ForEach-Object { $_ -replace '.*DATABASE_URL="?([^"]+)"?.*', '$1' }

Write-Host "📋 DATABASE_URL actuel: $currentUrl" -ForegroundColor Yellow
Write-Host ""
Write-Host "Si tu veux utiliser une DB cloud (Neon.tech):" -ForegroundColor Green
Write-Host "  1. Va sur https://neon.tech (connexion GitHub/Google)" -ForegroundColor Gray
Write-Host "  2. Crée un projet 'aigle-royale-dev'" -ForegroundColor Gray
Write-Host "  3. Copie la connection string PostgreSQL" -ForegroundColor Gray
Write-Host ""
Write-Host "Colle ta nouvelle DATABASE_URL (ou appuie sur Entrée pour garder l'actuelle):" -ForegroundColor Cyan
$newUrl = Read-Host

if ($newUrl -and $newUrl.Trim()) {
    # Mettre à jour le .env
    $envContent = Get-Content .env -Raw
    $envContent = $envContent -replace 'DATABASE_URL="?[^"]*"?', "DATABASE_URL=`"$newUrl`""
    Set-Content .env -Value $envContent -NoNewline
    Write-Host "✅ DATABASE_URL mis à jour" -ForegroundColor Green
} else {
    Write-Host "⏭️  Utilisation de l'URL actuelle" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔄 Génération du client Prisma..." -ForegroundColor Cyan
cmd /c "npm run db:generate"

Write-Host ""
Write-Host "📦 Application des migrations..." -ForegroundColor Cyan
cmd /c "npm run db:push"

Write-Host ""
Write-Host "🌱 Seed de la base de données (démo)..." -ForegroundColor Cyan
$env:DEMO_SEED = "true"
$env:ADMIN_PASSWORD = "admin123"
cmd /c "npm run db:seed"

Write-Host ""
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Redémarre le serveur dev:" -ForegroundColor Cyan
Write-Host "   cmd /c `"npm run dev`"" -ForegroundColor Gray
Write-Host ""
Write-Host "📍 Test de l'API destinations:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/api/destinations?take=6" -ForegroundColor Gray
