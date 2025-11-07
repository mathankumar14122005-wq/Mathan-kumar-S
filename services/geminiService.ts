import { GoogleGenAI } from "@google/genai";
import type { AspectRatio, VeoOperation } from '../types';

// Fix: Removed duplicate global window declaration as it is now centralized in types.ts.

const POLLING_INTERVAL = 10000; // 10 seconds

export const generateVideo = async (
  prompt: string,
  aspectRatio: AspectRatio,
  setLoadingMessage: (message: string) => void
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  setLoadingMessage("Initiating video generation... This may take a moment.");

  let operation: VeoOperation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  const loadingMessages = [
    "Warming up the creative engines...",
    "Assembling pixels into a masterpiece...",
    "Teaching virtual actors their lines...",
    "Rendering cinematic shots...",
    "Adding a touch of digital magic...",
    "Almost there, just polishing the final frames...",
  ];
  let messageIndex = 0;
  
  while (!operation.done) {
    setLoadingMessage(loadingMessages[messageIndex % loadingMessages.length]);
    messageIndex++;
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error("Video generation completed, but no download link was found.");
  }

  setLoadingMessage("Downloading your generated video...");

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to download video. Status: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  return URL.createObjectURL(videoBlob);
};
