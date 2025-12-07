export type User = {
	id: string;
	userLogin: string;
	credentials: Credentials;
	isInConfigMode: boolean;
	timerTargetDate: Date | null;
  quickLinks: QuickLink[];
	viewerHistory: ViewerRecord[];
};

export type Credentials = {
  accessToken: string;
  expiresIn: Date;
  refreshToken: string;
};

export type QuickLink = {
	id: string;
	title: string;
	url: string;
	color: string;
};

export type ViewerRecord = {
	count: number;
	timestamp: number;
};