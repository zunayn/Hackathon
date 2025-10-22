// File: src/components/FocusModeView.jsx
import React, { useState, useEffect } from 'react';

function FocusModeView({ task, onExit }) {
    const FOCUS_DURATION = 25 * 60; // 25 minutes
    const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center p-4 text-white">
            <p className="text-lg text-gray-400 mb-4">Focusing on:</p>
            <h1 className="text-4xl md:text-5xl font-bold text-center max-w-3xl">{task.text}</h1>
            <div className="my-12 font-mono text-8xl md:text-9xl tracking-widest">
                {formatTime(timeLeft)}
            </div>
             <p className="text-lg text-gray-300 mb-2">Estimated time: {task.eta}h</p>
            <button 
                onClick={onExit}
                className="mt-8 px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
            >
                End Session
            </button>
        </div>
    );
}

export default FocusModeView;

