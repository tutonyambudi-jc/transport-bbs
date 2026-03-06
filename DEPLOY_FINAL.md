# Deployment Status

- **Git Push:** Still running... Please wait for it to complete. 
  (If it hangs for >10 mins, stop it with Ctrl+C and try again manually: `git push origin main`)

- **Next Steps (On Server):**
  Once the push is done, switch to your SSH window and run:

  ```bash
  cd /var/www/aigle-royale
  git pull origin main
  npm run build
  pm2 reload ecosystem.config.js --update-env
  ```

  This will deploy your changes (wider search fields) to the live site.
