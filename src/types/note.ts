export interface NoteHistoryEntry {
  timestamp: Date;
  content: string;
}

export interface Note {
  id?: string;
  title: string;
  content: string;
  updatedAt: Date;
  history: NoteHistoryEntry[];
}

/** Note garantidamente persistida — id sempre presente após criação no Firestore */
export interface CreatedNote extends Note {
  id: string;
}
