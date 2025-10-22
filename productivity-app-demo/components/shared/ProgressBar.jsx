// File: src/components/shared/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ value, className = 'bg-blue-500' }) => (
    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div className={`${className} h-1.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
);

export default ProgressBar;

