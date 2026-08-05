
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-16">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
      <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-2 border-green-200 opacity-20"></div>
    </div>
  </div>
);
