# Deployment Instructions

1.  **Wait for `git push` to complete** on your local machine.

2.  **Connect to the server** (if not already connected):
    ```bash
    ssh deploy@173.212.223.209
    ```

3.  **Run these commands on the server**:
    ```bash
    cd /var/www/aigle-royale
    git pull origin main
    npm install
    npm run build
    pm2 reload ecosystem.config.js --update-env
    ```

4.  **Verify**:
    check if the changes (wider search form fields) are visible on the site.
