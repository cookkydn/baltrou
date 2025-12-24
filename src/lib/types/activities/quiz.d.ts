export interface QuizOption {
	id: string;
	label: string;
}

export interface QuizQuestion {
	id: string;
	text: string;
	image?: string;
	options: QuizOption[];
	correctOptionId: string | string[];
	explanation?: string;
}

export interface Quiz {
	id: string;
	mode: 'standart' | 'speed';
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

export interface QuizMetadata {
	id: string;
	title: string;
	questionCount: number;
}

export interface ActiveQuiz {
	metadata: QuizMetadata;
	mode: 'standart' | 'speed';
	questionNumber: number;
	question: QuizQuestion;
	revealAnswer: boolean;
	currentPlayerIndex: number;
	playerAnwsers: Record<string, string>;
}
