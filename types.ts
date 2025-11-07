export type AspectRatio = '16:9' | '9:16';

// This is a simplified type for the Veo operation.
// The actual operation object from the SDK is more complex.
export interface VeoOperation {
  done: boolean;
  name: string;
  response?: {
    generatedVideos?: {
      video?: {
        uri: string;
      };
    }[];
  };
}

// Fix: Consolidate global window type declaration here to avoid conflicts.
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
