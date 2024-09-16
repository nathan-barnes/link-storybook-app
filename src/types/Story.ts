// src/types/Story.ts
export interface Story {
    id: string;
    title: string;
    description: string;
    pdfUrl: string;
    audioUrl?: string;
    imageUrl: string; // Add imageUrl for the title image
  }
  