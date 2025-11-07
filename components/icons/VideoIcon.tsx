
import React from 'react';

const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-2.121l4.156 2.456a.75.75 0 001.094-.658v-6.652a.75.75 0 00-1.094-.658L15.75 12.621V7.5a3 3 0 00-3-3H4.5z" />
  </svg>
);

export default VideoIcon;
