// File: src/components/AiPlannerModal.jsx
import React, { useState } from 'react';
import { BrainCircuitIcon, Trash2Icon } from './shared/Icons';
import { createNewTask } from '../api/constants';

function AiPlannerModal({ assignments, onSavePlan, onCancel }) {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState('select'); // select, review
    const [plannedAssignment, setPlannedAssignment] = useState(null);

    const handlePlan = (assignment) => {
        setIsLoading(true);
        setStep('loading');
        setTimeout(() => {
            const newTasks = [
                createNewTask('AI: Research and Information Gathering', 5),
                createNewTask('AI: Create Detailed Outline', 3),
                createNewTask('AI: Write First Draft', 8),
                createNewTask('AI: Review, Edit, and Finalize', 4),
            ];
            const totalEta = newTasks.reduce((sum, task) => sum + task.eta, 0);

            setPlannedAssignment({
                ...assignment,
                tasks: newTasks,
                totalEta: totalEta,
            });
            setIsLoading(false);
            setStep('review');
        }, 1500);
    };

    const handleTaskChange = (taskId, newText) => {
        const updatedTasks = plannedAssignment.tasks.map(t => t.id === taskId ? { ...t, text: newText } : t);
        setPlannedAssignment({ ...plannedAssignment, tasks: updatedTasks });
    };

    const handleDeleteTask = (taskId) => {
        const updatedTasks = plannedAssignment.tasks.filter(t => t.id !== taskId);
        const totalEta = updatedTasks.reduce((sum, task) => sum + task.eta, 0);
        setPlannedAssignment({ ...plannedAssignment, tasks: updatedTasks, totalEta });
    };
    
    const handleFinalize = () => { onSavePlan(plannedAssignment); };

    return (
        <div>
            {step === 'select' && (
                <div className="space-y-4">
                    <h3 className="font-bold">Select an Assignment to Plan</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose an assignment and the AI will generate a project plan with milestones for you.</p>
                    <div className="space-y-2 max-h-80 overflow-y-auto border-t border-b dark:border-gray-700 py-2">
                        {assignments.length > 0 ? assignments.map(a => (
                            <div key={a.id} onClick={() => handlePlan(a)} className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <p className="font-semibold">{a.title}</p>
                                <p className="text-sm text-gray-500">{a.course} - Due: {a.dueDate}</p>
                            </div>
                        )) : <p className="text-center text-gray-500 py-4">No unplanned assignments found. Sync with Canvas or create one!</p>}
                    </div>
                     <div className="flex justify-end gap-2 pt-2"><button onClick={onCancel} className="px-4 py-2 text-sm rounded-md border">Cancel</button></div>
                </div>
            )}
            {step === 'loading' && (
                 <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <div className="relative h-24 w-24">
                        <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-ping"></div>
                        <div className="absolute inset-2 border-2 border-blue-300 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                         <div className="absolute inset-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <BrainCircuitIcon className="w-10 h-10 text-white"/>
                        </div>
                    </div>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">Generating Plan...</p>
                    <p className="text-sm text-gray-500 text-center">Breaking down your assignment into actionable milestones...</p>
                </div>
            )}
            {step === 'review' && plannedAssignment && (
                <div className="space-y-4">
                    <h3 className="font-bold">Suggested Plan for "{plannedAssignment.title}"</h3>
                    <p><b>Course:</b> {plannedAssignment.course}</p>
                    <p><b>Due:</b> {plannedAssignment.dueDate}</p>
                    <p><b>Total Estimated Time:</b> {plannedAssignment.totalEta} hours</p>

                    <h4 className="font-semibold pt-2 border-t dark:border-gray-600">Suggested Milestones:</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {plannedAssignment.tasks.map(task => (
                            <div key={task.id} className="flex items-center gap-2">
                                <input type="text" value={task.text} onChange={(e) => handleTaskChange(task.id, e.target.value)} className="flex-grow rounded-md text-sm dark:bg-gray-900"/>
                                <span className="text-sm font-mono px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">{task.eta}h</span>
                                <button onClick={() => handleDeleteTask(task.id)}><Trash2Icon className="w-4 h-4 text-gray-400 hover:text-red-500"/></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setStep('select')} className="px-4 py-2 text-sm rounded-md border">Back</button>
                        <button onClick={handleFinalize} className="px-4 py-2 text-sm text-white bg-green-600 rounded-md">Create Plan</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AiPlannerModal;

