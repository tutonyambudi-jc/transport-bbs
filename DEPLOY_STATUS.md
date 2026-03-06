
# Deployment Status

## Git Push
Checking if git push completed...

## Next Steps (Server)
Once the push finishes, run these commands on the server:

1.  `cd /var/www/aigle-royale`
2.  `git pull origin main`
3.  `npm install` (just in case)
4.  `npm run build`
5.  `pm2 reload ecosystem.config.js --update-env`

Verify changes on the live site.
