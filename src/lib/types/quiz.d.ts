export interface QuizOption {
	id: string; 
	label: string;
}

export interface QuizQuestion {
	id: string;
	text: string; 
	image?: string; 
	options: QuizOption[]; 
	correctOptionId: string;
	mode: 'default' | 'speed'
	explanation?: string;
}

export interface Quiz {
	id: string;
	title: string;
	description?: string;
	author?: string;
	version: number;
	questions: QuizQuestion[];
}

export interface ValidationResult {
	isValid: boolean;
	error?: string;
}