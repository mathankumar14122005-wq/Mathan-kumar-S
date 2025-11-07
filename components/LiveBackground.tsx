
import React from 'react';

const LiveBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900">
        <div 
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[spin_15s_linear_infinite]"
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-3xl"></div>
      </div>
    </div>
  );
};

export default LiveBackground;
