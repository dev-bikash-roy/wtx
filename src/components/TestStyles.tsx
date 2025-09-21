import React from 'react';

const TestStyles = () => {
  return (
    <div className="p-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <h1 className="text-2xl font-bold mb-4">Style Test Component</h1>
      <p className="mb-2">If you can see this text with proper styling, CSS is working.</p>
      <div className="flex items-center space-x-2 mt-4">
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
      </div>
      <button className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
        Test Button
      </button>
    </div>
  );
};

export default TestStyles;