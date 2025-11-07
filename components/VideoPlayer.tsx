
import React from 'react';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 rounded-lg overflow-hidden shadow-2xl shadow-purple-500/20">
      <video
        key={src} // Force re-render when src changes
        controls
        autoPlay
        loop
        className="w-full h-full object-contain"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
