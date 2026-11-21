import fs from "fs/promises";
import path from "path";
import type { Feedback } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "feedback.json");

// TODO: Implement getAllFeedback
// Read the JSON file at DATA_PATH and return the parsed array.
export async function getAllFeedback(): Promise<Feedback[]> {
  const raw = await fs.readFile(DATA_PATH, 'utf-8')
  return JSON.parse(raw);
}

// TODO: Implement getFeedbackById
// Find a single entry by its id, or return undefined.
export async function getFeedbackById(
  id: string
): Promise<Feedback | undefined> {
  const allData = await getAllFeedback();
  const feedback = allData.find((f) => f.id === id)
  return feedback
}

// TODO: Implement addFeedback
// Generate an id and createdAt, append the entry to the file, return it.
export async function addFeedback(
  entry: Omit<Feedback, "id" | "createdAt">
): Promise<Feedback> {
  const allData = await getAllFeedback();
  const newEntry = {
    ...entry,
    id: `fb-${String(allData.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString()
  }
  allData.push(newEntry);
  fs.writeFile(DATA_PATH, JSON.stringify(allData, null, 2))
  return newEntry
}
