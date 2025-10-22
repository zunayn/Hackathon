// File: src/components/ScoreBreakdownModal.jsx
import React from 'react';
import Modal from './shared/Modal';
import { AlertTriangleIcon, CheckIcon } from './shared/Icons';

function ScoreBreakdownModal({ analysis, onFix, onClose }) {
    return (
        <Modal isOpen={true} onClose={onClose} title="Compliance Score Breakdown">
            <div className="space-y-4 text-sm">
                <div>
                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">What You're Doing Right:</h3>
                    <ul className="space-y-1">
                        {(analysis.strengths || []).map((strength, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border-t dark:border-gray-700 pt-3">
                     <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">Areas for Improvement:</h3>
                     <ul className="space-y-2">
                        {(analysis.weaknesses || []).map((weakness, i) => (
                            <li key={i} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <AlertTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    <span>{weakness}</span>
                                </div>
                                <button onClick={onFix} className="text-xs font-semibold text-blue-600 hover:underline">Fix</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Modal>
    );
}

export default ScoreBreakdownModal;

