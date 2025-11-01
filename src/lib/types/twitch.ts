export class TwitchApiError extends Error {
    status: number;
    // Ajout d'un champ pour contenir les détails de l'erreur JSON de Twitch
    details: string; 

    constructor(status: number, message: string, details?: string) {
        super(message);
        this.status = status;
        this.details = details || 'unknown error';
        this.name = 'TwitchApiError';
    }
}