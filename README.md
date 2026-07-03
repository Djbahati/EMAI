# EMAIL Project

Local setup

- Copy `mail.env` and update credentials (or create a `.env` file and set SMTP vars):

```
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
MONGO_URI=mongodb://localhost:27017/crm
# Optional SMTP overrides:
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
```

Install and run:

```powershell
npm install
npm run start
# or for development with auto-restart:
npm run dev
```

Notes

- The server is located at `node.js/server.js` and exposes `/api/send-email` and contact endpoints.
- If no SMTP settings are provided, the server will use an Ethereal test account for local testing and return a preview URL in responses.
- Frontend React components are present in the project root (e.g., `compose.js`). They expect the API at `/api/send-email`.
