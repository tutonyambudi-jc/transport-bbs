# Debugging 'Booking Error'

I have updated the booking API to return the detailed error message instead of the generic one.

1.  **Wait for `git push` to complete.**

2.  **Deploy the change to the server:**
    ```bash
    ssh deploy@173.212.223.209
    cd /var/www/aigle-royale
    git pull origin main
    npm run build
    pm2 reload ecosystem.config.js --update-env
    ```

3.  **Reproduce the error:**
    - Try to book again.
    - If it fails, open your browser's Developer Tools (F12) -> Network tab.
    - Find the `POST` request to `/api/bookings`.
    - Click it and check the **Response** tab.
    - You should see a JSON object with `error`, `details`, and `stack`.
    - **Copy the `details` and paste it here.**

This will tell us exactly why the booking is failing (e.g., database constraint, missing field, etc.).
