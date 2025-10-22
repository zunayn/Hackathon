// File: src/components/CrawlerAnimation.jsx
import React from 'react';
import { BrainCircuitIcon } from './shared/Icons';

function CrawlerAnimation() {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative h-24 w-24">
                <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-2 border-blue-300 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                 <div className="absolute inset-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <BrainCircuitIcon className="w-10 h-10 text-white"/>
                </div>
            </div>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">Analyzing Professor...</p>
            <p className="text-sm text-gray-500 text-center">Crawling syllabus and RateMyProfessor for insights...</p>
        </div>
    );
}

export default CrawlerAnimation;

