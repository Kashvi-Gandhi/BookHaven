# Security Configuration Guide

## Firebase Configuration Security

### ⚠️ IMPORTANT SECURITY NOTICE

The hardcoded Firebase credentials have been removed from the codebase to prevent security vulnerabilities. Follow these steps to configure Firebase securely:

### 1. Update Firebase Configuration

Edit `firebase-config.js` and replace the placeholder values with your actual Firebase project credentials:

```javascript
export const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.firebasestorage.app",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
```

### 2. Environment Variables (Recommended for Production)

For production deployments, use environment variables:

1. Create a `.env` file in your project root
2. Add your Firebase credentials:
   ```
   FIREBASE_API_KEY=your_actual_api_key
   FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
   FIREBASE_DATABASE_URL=your_actual_database_url
   FIREBASE_PROJECT_ID=your_actual_project_id
   FIREBASE_STORAGE_BUCKET=your_actual_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_actual_messaging_sender_id
   FIREBASE_APP_ID=your_actual_app_id
   ```
3. Use a build tool (Webpack, Vite, etc.) to inject these at build time

### 3. Security Best Practices

- **Never commit credentials to version control**
- Add `firebase-config.js` and `.env` to your `.gitignore` file
- Use Firebase Security Rules to restrict database access
- Implement proper authentication and authorization
- Regularly rotate API keys and credentials

### 4. Firebase Security Rules

Configure your Firebase Realtime Database rules:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 5. Getting Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on your web app or create a new one
6. Copy the configuration object

### 6. Troubleshooting

If you see "Firebase configuration not set" in the console:
1. Check that `firebase-config.js` has your actual credentials
2. Ensure the file is properly imported
3. Verify your Firebase project is active and configured correctly

---

**Remember**: Keep your Firebase credentials secure and never expose them in public repositories!