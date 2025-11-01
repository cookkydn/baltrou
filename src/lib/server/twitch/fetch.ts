import { TWITCH_CLIENT_ID } from "$env/static/private";
import { TwitchApiError } from "$lib/types/twitch";

// URL de base de l'API Twitch Helix
const TWITCH_API_BASE_URL = 'https://api.twitch.tv/helix';

/**
 * Fonction wrapper typée et sécurisée pour effectuer des requêtes à l'API Twitch (Helix).
 * @param endpoint - L'endpoint Helix (ex: 'users', 'streams').
 * @param token - Le jeton d'accès Bearer de l'utilisateur.
 * @param options - Les options standards de fetch (méthode, body, etc.).
 * @returns Une promesse qui résout au corps JSON de la réponse Twitch, typé comme T.
 */
export async function twitchFetch<T>(
    endpoint: string, 
    token: string, 
    options: RequestInit = {}
): Promise<T> {

    // 1. Définition des Headers d'Authentification et de Type
    const authHeaders: HeadersInit = {
        'Authorization': `Bearer ${token}`,
        'Client-ID': TWITCH_CLIENT_ID,
        // S'assurer que le Content-Type est appliqué uniquement si un body est présent
        ...(options.body && { 'Content-Type': 'application/json' })
    };

    try {
        const url = `${TWITCH_API_BASE_URL}/${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...authHeaders,
                ...(options.headers as Record<string, string>) // Fusion avec les headers de l'appelant
            }
        });

        // 2. Traitement des Erreurs (Status HTTP non-2xx)
        if (!response.ok) {
            let errorDetails: string = "";
            
            // Tenter de lire le corps JSON même en cas d'erreur (Twitch renvoie des détails ici)
            try {
                errorDetails = (await response.json()).message;
            } catch {
                // Si ce n'est pas du JSON, on lit le texte brut
                errorDetails = await response.text(); 
            }

            // Lancer l'erreur personnalisée
            throw new TwitchApiError(
                response.status, 
                `Twitch API call failed on ${endpoint}: ${errorDetails || 'Unknown error.'}`,
                errorDetails
            );
        }

        // 3. Retour du Corps de la Réponse Typée
        // Vérifie si la réponse est vide (e.g., statut 204 No Content)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return {} as T; // Retourne un objet vide si T est un objet, ou lève un avertissement si nécessaire
        }
        
        return (await response.json()) as T;

    } catch (e) {
        // Relancer l'erreur structurée (TwitchApiError)
        if (e instanceof TwitchApiError) throw e; 
        
        // Capter les erreurs réseau ou Fetch non structurées
        console.error('Network or unexpected error during Twitch fetch:', e);
        // Lancer une erreur TwitchApiError générique
        throw new TwitchApiError(500, 'Network failure or unhandled internal error.', String(e));
    }
}