### 🚀 Deployment Instructions

The `git push` is currently running. Once complete:

1.  **Switch to your SSH terminal** (`ssh deploy@...`).

2.  **Pull the latest code:**
    ```bash
    cd /var/www/aigle-royale
    git pull origin main
    ```

3.  **Rebuild the application (Frontend changes require this):**
    ```bash
    npm run build
    ```

4.  **Restart the server:**
    ```bash
    pm2 reload ecosystem.config.js --update-env
    ```

5.  **Status check:**
    ```bash
    pm2 status
    ```
