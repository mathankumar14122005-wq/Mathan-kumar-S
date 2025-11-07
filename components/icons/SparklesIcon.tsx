
import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-7.19c0-1.767.96-3.364 2.432-4.226zM6.75 22.5a.75.75 0 01-.75-.75v-7.19c0-1.767.96-3.364 2.432-4.226-1.472-.862-2.432-2.46-2.432-4.226V2.25a.75.75 0 01.75-.75C3.806 1.5 0 5.806 0 12c0 6.194 3.806 10.5 6.75 10.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default SparklesIcon;
