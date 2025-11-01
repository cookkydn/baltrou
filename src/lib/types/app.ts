/**
 * Informations d'identification nécessaires pour faire des appels API Twitch au nom de l'utilisateur.
 * Ces données sont stockées dans un cookie et extraites dans locals.
 */
export interface Credentials {
    /** Informations relatives a l'authentification twitch */
    twitch: {
        /** Le Bearer Token réel pour l'API Twitch (Helix/TMI). */
        token: string;
    
        /** L'ID unique de l'utilisateur Twitch (nécessaire pour broadcaster_id, etc.). */
        userId: string;
        
        /** Le login/nom d'utilisateur Twitch (nécessaire pour rejoindre le chat TMI). */
        userLogin: string; 
    
        /** Timestamp de l'expiration du token pour gérer le renouvellement. */
        expiresAt: number; 
    
        /** Token utilisé en cas d'expiration du token original pour régénérer un nouveau token */
        refreshToken: string;
    } | null;
}