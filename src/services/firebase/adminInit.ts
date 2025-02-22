import { getApps, initializeApp, cert } from 'firebase-admin/app';

export function initializeFirebaseAdmin() {
    const apps = getApps();
    if (apps.length > 0) {
        return apps[0];
    }

    // Check if environment variables are properly set
    if (!process.env.FIREBASE_PROJECT_ID || 
        !process.env.FIREBASE_CLIENT_EMAIL || 
        !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error(
            'Firebase Admin environment variables are missing. Please check your .env.local file for:\n' +
            'FIREBASE_PROJECT_ID\n' +
            'FIREBASE_CLIENT_EMAIL\n' +
            'FIREBASE_PRIVATE_KEY'
        );
    }

    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    try {
        return initializeApp({
            credential: cert(serviceAccount),
        });
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
        throw new Error('Failed to initialize Firebase Admin. Check your service account credentials.');
    }
} 