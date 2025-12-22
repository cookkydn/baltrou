import type { Quiz, QuizMetadata, ValidationResult } from "$lib/types/activities/quiz";
import { error } from "@sveltejs/kit";
import { db } from "../db";
import { rm } from "fs/promises";

export async function getQuizzes(userId:string): Promise<QuizMetadata[]> {
	await db.read();
	const user = db.data.users.find(u=>u.id == userId);
  if(!user) {
    throw error(404,"User not found")
  }
	return user.activities.quizList;
}

export async function addQuiz(metadata:QuizMetadata, userId: string) {
  await db.read();
  const user = db.data.users.find(u=>u.id == userId);
  if(!user) {
    throw error(404,"User not found")
  }
	if(user.activities.quizList){
		if(!user.activities.quizList.map(q=>q.id).includes(metadata.id)) {
			user.activities.quizList = [metadata, ...user.activities.quizList];
		}
	} else {
		user.activities.quizList = [metadata]
	}
  await db.write();
}

export function extractQuizMetadata(data: Quiz): QuizMetadata {
	return {id: data.id, questionCount: data.questions.length, title: data.title}
}

export function validateQuizSet(data: any): ValidationResult {
	if (!data || typeof data !== 'object') {
		return { isValid: false, error: 'File is not a valid JSON' };
	}

	const requiredSetFields = ['id', 'title', 'version', 'questions','mode'];
	for (const field of requiredSetFields) {
		if (!(field in data)) {
			return { isValid: false, error: `Root field '${field}' missing.` };
		}
	}

	if (!Array.isArray(data.questions)) {
		return { isValid: false, error: "The field 'questions' must be an array" };
	}

	if (data.questions.length === 0) {
		return { isValid: false, error: "No questions" };
	}

	for (let i = 0; i < data.questions.length; i++) {
		const q = data.questions[i];
		const indexStr = `Question #${i + 1}`;

		if (!q.id || typeof q.id !== 'string') return { isValid: false, error: `${indexStr} : Missing or invalid ID.` };
		if (!q.text || typeof q.text !== 'string') return { isValid: false, error: `${indexStr} : No question text.` };
		
		if (!Array.isArray(q.options) || q.options.length < 2) {
			return { isValid: false, error: `${indexStr} : At least 2 questions needed.` };
		}

		const optionIds = new Set<string>();
		
		for (const opt of q.options) {
			if (!opt.id || !opt.label) {
				return { isValid: false, error: `${indexStr} : Malformated option` };
			}
			if (optionIds.has(opt.id)) {
				return { isValid: false, error: `${indexStr} : Duplicate option id '${opt.id}'.` };
			}
			optionIds.add(opt.id);
		}

		if(!q.correctOptionId) {
			return { isValid: false, error: `${indexStr} : 'correctOptionId' (${q.correctOptionId}) is not a valid ID` };
		} else if (Array.isArray(q.correctOptionId) && !q.correctOptionId.every((i: string)=>optionIds.has(i))) {
			return { isValid: false, error: `${indexStr} : 'correctOptionId' (${q.correctOptionId}) contains an invalid ID` };
		} else if(!Array.isArray(q.correctOptionId) && !optionIds.has(q.correctOptionId)) {
			return { isValid: false, error: `${indexStr} : 'correctOptionId' (${q.correctOptionId}) is not a valid ID` };
		}
	}

	return { isValid: true };
}

export async function deleteQuiz(quizId: string, userId: string){
	await rm(`data/quizzes/${quizId}.json`);
	await db.read();
	const user = db.data.users.find(u=>u.id == userId);
  if(!user) {
    throw error(404,"User not found")
  }
	user.activities.quizList = user.activities.quizList.filter(q=>q.id != quizId);
	await db.write()
}