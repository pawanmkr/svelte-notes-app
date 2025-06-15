const API_URL = "https://684e7f1bf0c9c9848d284a81.mockapi.io/mock/notes";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// Helper function to convert API response to Note type
function convertToNote(data: any): Note {
  return {
    ...data,
    id: Number(data.id), // Convert string ID to number
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export async function getNotes(): Promise<Note[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    console.error("API Error:", response.status, response.statusText);
    throw new Error("Failed to fetch notes");
  }
  const data = await response.json();
  console.log("Raw API response:", data); // Debug log
  const notes = Array.isArray(data) ? data.map(convertToNote) : [];
  console.log("Converted notes:", notes); // Debug log
  return notes;
}

export async function createNote(
  note: Omit<Note, "id" | "createdAt">
): Promise<Note> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to create note");
  const data = await response.json();
  return convertToNote(data);
}

export async function updateNote(
  id: number,
  note: Partial<Note>
): Promise<Note> {
  console.log("Updating note:", id, note); // Debug log
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    console.error("API Error:", response.status, response.statusText);
    throw new Error("Failed to update note");
  }
  const data = await response.json();
  console.log("Raw API response:", data); // Debug log
  const updatedNote = convertToNote(data);
  console.log("Converted note:", updatedNote); // Debug log
  return updatedNote;
}

export async function deleteNote(id: number): Promise<void> {
  console.log("Deleting note:", id); // Debug log
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    console.error("API Error:", response.status, response.statusText);
    throw new Error("Failed to delete note");
  }
  console.log("Note deleted successfully"); // Debug log
}
