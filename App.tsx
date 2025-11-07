import React, { useState, useCallback, useEffect } from 'react';
import { generateVideo } from './services/geminiService';
import LiveBackground from './components/LiveBackground';
import LoadingSpinner from './components/LoadingSpinner';
import VideoPlayer from './components/VideoPlayer';
import SparklesIcon from './components/icons/SparklesIcon';
import VideoIcon from './components/icons/VideoIcon';
import type { AspectRatio } from './types';

// Fix: Removed duplicate global window declaration as it is now centralized in types.ts.

const ApiKeySelector: React.FC<{ onKeySelected: () => void }> = ({ onKeySelected }) => {
  return (
    <div className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4">API Key Required</h2>
      <p className="text-gray-300 mb-6">
        To use Vidgen, please select an API key. Video generation is a billable feature.
      </p>
      <button
        onClick={async () => {
          await window.aistudio.openSelectKey();
          onKeySelected();
        }}
        className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Select API Key
      </button>
      <p className="text-xs text-gray-400 mt-4">
        For more information, see the{' '}
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-300">
          billing documentation
        </a>.
      </p>
    </div>
  );
};


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate a video.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedVideoUrl(null);

    try {
      const videoUrl = await generateVideo(prompt, aspectRatio, setLoadingMessage);
      setGeneratedVideoUrl(videoUrl);
    } catch (err: any) {
      console.error(err);
      let errorMessage = "An unexpected error occurred during video generation.";
      if (err instanceof Error) {
        if (err.message.includes("Requested entity was not found")) {
            errorMessage = "Your API key seems to be invalid. Please select a valid key.";
            setApiKeySelected(false); // Reset to show the key selector
        } else {
            errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt, aspectRatio]);

  const onKeySelected = () => {
    // Assume key selection is successful to avoid race conditions
    setApiKeySelected(true);
  };
  
  return (
    <>
      <LiveBackground />
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 text-white font-sans overflow-y-auto">
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center flex-grow z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Vidgen
            </h1>
            <p className="mt-2 text-lg text-gray-300">Bring your ideas to life with AI-powered video.</p>
          </div>

          {!apiKeySelected ? (
             <ApiKeySelector onKeySelected={onKeySelected} />
          ) : (
            <div className="w-full bg-black/30 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
              <div className="space-y-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A neon hologram of a cat driving at top speed"
                  className="w-full p-4 bg-gray-900/50 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-gray-400 min-h-[120px] resize-none"
                  rows={4}
                  disabled={isLoading}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                    <div className="flex items-center gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-600">
                       <button onClick={() => setAspectRatio('16:9')} disabled={isLoading} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${aspectRatio === '16:9' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>16:9 Landscape</button>
                       <button onClick={() => setAspectRatio('9:16')} disabled={isLoading} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${aspectRatio === '9:16' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>9:16 Portrait</button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleGenerateClick}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-8 text-center text-purple-300">
              <p>{loadingMessage}</p>
              <p className="text-sm text-gray-400 mt-2">Video generation can take a few minutes. Please be patient.</p>
            </div>
          )}
          
          {error && (
            <div className="mt-8 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-center w-full max-w-2xl">
              <p>{error}</p>
            </div>
          )}

          {generatedVideoUrl && !isLoading && (
            <div className="w-full mt-8">
              <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
                <VideoIcon className="w-7 h-7" />
                Your Masterpiece is Ready!
              </h2>
              <VideoPlayer src={generatedVideoUrl} />
            </div>
          )}
        </main>
        
        <footer className="w-full text-center text-gray-400 text-sm p-4 z-10 mt-8">
          Developed by Mathan Kumar S
        </footer>
      </div>
    </>
  );
};

export default App;
