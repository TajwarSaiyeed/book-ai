import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TextSegment } from "@/types";
import { DEFAULT_VOICE, voiceOptions } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitIntoSegments(text: string, wordsPerSegment = 200): TextSegment[] {
  const words = text.split(/\s+/).filter(Boolean);
  const segments: TextSegment[] = [];

  for (let i = 0; i < words.length; i += wordsPerSegment) {
    const segmentWords = words.slice(i, i + wordsPerSegment);
    segments.push({
      text: segmentWords.join(" "),
      segmentIndex: segments.length,
      wordCount: segmentWords.length,
    });
  }

  return segments;
}

export async function parsePDFFile(file: File) {
  try {
    const pdfjsLib = await import("pdfjs-dist");

    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
    }

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    // Render first page as cover image
    const firstPage = await pdfDocument.getPage(1);
    const viewport = firstPage.getViewport({ scale: 2 }); // 2x scale for better quality

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not get canvas context");
    }

    await firstPage.render({
      canvasContext: context,
      viewport: viewport,
    } as any).promise;

    // Convert canvas to data URL
    const coverDataURL = canvas.toDataURL("image/png");

    // Extract text from all pages
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item) => "str" in item)
        .map((item) => (item as { str: string }).str)
        .join(" ");
      fullText += pageText + "\n";
    }

    // Split text into segments for search
    const segments = splitIntoSegments(fullText);

    // Clean up PDF document resources
    await pdfDocument.destroy();

    return {
      content: segments,
      cover: coverDataURL,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error(
      `Failed to parse PDF file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const serializeData = <T>(data: T): T => JSON.parse(JSON.stringify(data));

// Auto generate slug
export function generateSlug(text: string): string {
  return text
    .replace(/\.[^/.]+$/, "") // Remove file extension (.pdf, .txt, etc.)
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[^\w\s-]/g, "") // Remove special characters (keep letters, numbers, spaces, hyphens)
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Escape regex special characters to prevent ReDoS attacks
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Upload file to Vercel Blob via server route
export async function uploadFileToBlob(filename: string, file: File, contentType: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);
    formData.append("contentType", contentType);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error(
      `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Get voice data by persona key or voice ID
export const getVoice = (persona?: string) => {
  if (!persona) return voiceOptions[DEFAULT_VOICE];

  // Find by voice ID
  const voiceEntry = Object.values(voiceOptions).find((v) => v.id === persona);
  if (voiceEntry) return voiceEntry;

  // Find by key
  const voiceByKey = voiceOptions[persona as keyof typeof voiceOptions];
  if (voiceByKey) return voiceByKey;

  // Default fallback
  return voiceOptions[DEFAULT_VOICE];
};
