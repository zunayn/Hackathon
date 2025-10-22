// File: src/components/AssignmentDetail.jsx
import React, { useState, useMemo } from 'react';
import Card from './shared/Card';
import ProgressBar from './shared/ProgressBar';
import { EditIcon, Trash2Icon, FocusIcon, CheckCircleIcon } from './shared/Icons';
import CrawlerAnimation from './CrawlerAnimation';
import FocusModeView from './FocusModeView';
import { mockCrawlerAPI } from '../api/mockApi';
import { createNewTask } from '../api/constants';

function AssignmentDetail({ assignment, onBack, onUpdate, onOpenModal }) {
    const [isAddingMilestone, setIsAddingMilestone] = useState(false);
    const [isEditingMilestones, setIsEditingMilestones] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskEta, setNewTaskEta] = useState('');
    const [editedTasks, setEditedTasks] = useState(assignment.tasks);
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [focusTask, setFocusTask] = useState(null);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskText || !newTaskEta) return;
        const newTask = createNewTask(newTaskText, parseFloat(newTaskEta));
        const updatedTasks = [...assignment.tasks, newTask];
        const updatedTotalEta = (assignment.totalEta || 0) + parseFloat(newTaskEta);
        onUpdate({ ...assignment, tasks: updatedTasks, totalEta: updatedTotalEta });
        setNewTaskText('');
        setNewTaskEta('');
        setIsAddingMilestone(false);
    };
    
    const handleToggleEdit = () => {
        if (isEditingMilestones) {
            // Save changes
            const updatedTotalEta = editedTasks.reduce((sum, task) => sum + (task.eta || 0), 0);
            onUpdate({...assignment, tasks: editedTasks, totalEta: updatedTotalEta});
        } else {
            // Enter edit mode
            setEditedTasks(assignment.tasks);
        }
        setIsEditingMilestones(!isEditingMilestones);
    }
    
    const handleEditTaskText = (taskId, newText) => {
        setEditedTasks(editedTasks.map(t => t.id === taskId ? {...t, text: newText} : t));
    };

    const handleDeleteTask = (taskId) => {
        const taskToDelete = assignment.tasks.find(t => t.id === taskId);
        const updatedTasks = assignment.tasks.filter(t => t.id !== taskId);
        const updatedTotalEta = (assignment.totalEta || 0) - (taskToDelete?.eta || 0);
        onUpdate({ ...assignment, tasks: updatedTasks, totalEta: updatedTotalEta });
    };
    
    const handleToggleTask = (taskId) => {
        if(isEditingMilestones) return;
        const updatedTasks = assignment.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        onUpdate({ ...assignment, tasks: updatedTasks });
    };

    const handleAnalyzeProfessor = async () => {
        setIsAnalyzing(true);
        const analysis = await mockCrawlerAPI.analyzeProfessor(assignment.professorAnalysis.name);
        onUpdate({...assignment, professorAnalysis: analysis});
        setIsAnalyzing(false);
    };

     const handleFixWeakness = () => {
        // Close the score breakdown modal first
        onOpenModal(null); // Assuming null closes the current modal
        // Then open the edit project modal
        onOpenModal('update-individual', assignment);
        // Optionally, you could also set edit mode for milestones here
        setIsEditingMilestones(true);
        setEditedTasks(assignment.tasks);
    };


    const completedEta = useMemo(() => assignment.tasks.filter(t => t.completed).reduce((sum, task) => sum + task.eta, 0), [assignment.tasks]);
    const progress = (assignment.totalEta && assignment.totalEta > 0) ? (completedEta / assignment.totalEta) * 100 : 0;
    const analysisComplete = assignment.professorAnalysis && assignment.professorAnalysis.rating > 0;

    const getScoreColor = (score) => {
        if (score < 60) return 'text-red-500';
        if (score < 85) return 'text-yellow-500';
        return 'text-green-500';
    };

    if (focusTask) {
        return <FocusModeView task={focusTask} onExit={() => setFocusTask(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-500 mb-2">← Back to Dashboard</button>
                    <p className="font-semibold text-blue-500">{assignment.course}</p>
                    <h1 className="text-4xl font-extrabold">{assignment.title}</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl"><span className="font-semibold">Your goal:</span> {assignment.description}</p>
                </div>
                <button onClick={() => onOpenModal('update-individual', assignment)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><EditIcon className="w-5 h-5 text-gray-500"/></button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Card className="p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Your Milestones</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setIsAddingMilestone(!isAddingMilestone)} className="text-sm font-semibold text-blue-600 hover:underline">{isAddingMilestone ? 'Cancel' : 'Add Milestone'}</button>
                                <button onClick={handleToggleEdit} className="text-sm font-semibold text-blue-600 hover:underline">{isEditingMilestones ? 'Save Changes' : 'Edit Milestones'}</button>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">Estimated: <b>{assignment.totalEta || 0}h</b>. Completed: <b>{completedEta.toFixed(1)}h</b>.</div>
                        <div className="mt-4"><ProgressBar value={progress} /></div>
                        
                        <ul className="mt-8">
                             {isEditingMilestones ? editedTasks.map((task, index) => (
                                <li key={task.id} className="flex gap-x-4 items-center mb-4">
                                    <div className="h-6 w-6 flex-none rounded-full bg-gray-100 dark:bg-gray-700" />
                                    <input type="text" value={task.text} onChange={(e) => handleEditTaskText(task.id, e.target.value)} className="flex-grow rounded-md text-sm p-2 dark:bg-gray-900 border dark:border-gray-600" />
                                </li>
                             )) : assignment.tasks.map((task, index) => {
                                const tip = analysisComplete ? assignment.professorAnalysis.tips[index % assignment.professorAnalysis.tips.length] : null;
                                return (
                                    <li key={task.id} className="relative flex gap-x-4">
                                        {/* Timeline line - Hide for the last item */}
                                        <div className={`absolute left-3 top-6 bottom-0 w-px bg-gray-200 dark:bg-gray-700 ${index === assignment.tasks.length - 1 ? 'hidden' : ''}`}></div>
                                        {/* Milestone marker */}
                                        <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white dark:bg-gray-800">
                                            {task.completed ? (
                                              <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                            ) : (
                                              <div className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-800" />
                                            )}
                                        </div>
                                        {/* Milestone content */}
                                        <div className={`flex-grow ${index === assignment.tasks.length - 1 ? '' : 'pb-8'}`}>
                                            <div className="flex justify-between items-center group">
                                                <p onClick={() => handleToggleTask(task.id)} className={`font-semibold cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.text}</p>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setFocusTask(task)} className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity"><FocusIcon className="w-4 h-4 text-gray-500"/></button>
                                                    <span className="text-sm font-mono px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">{task.eta}h</span>
                                                    <button onClick={() => handleDeleteTask(task.id)}><Trash2Icon className="w-4 h-4 text-gray-400 hover:text-red-500"/></button>
                                                </div>
                                            </div>
                                            {tip && <p className="text-xs text-gray-500 mt-1 italic">[<span className="font-semibold">Professor's Tip:</span> {tip}]</p>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        {isAddingMilestone && (
                            <form onSubmit={handleAddTask} className="flex gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                                <input type="text" autoFocus value={newTaskText} onChange={e=>setNewTaskText(e.target.value)} placeholder="Add a new milestone..." className="flex-grow rounded-md dark:bg-gray-700"/>
                                <input type="number" value={newTaskEta} onChange={e=>setNewTaskEta(e.target.value)} placeholder="ETA (h)" className="w-24 rounded-md dark:bg-gray-700"/>
                                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md">Add</button>
                            </form>
                        )}
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-bold">AI Professor Insights</h2>
                        {isAnalyzing ? <CrawlerAnimation /> : (
                            analysisComplete ? (
                                <div className="space-y-4 mt-4">
                                    <div className="flex items-start justify-center space-x-4">
                                        <div onClick={() => onOpenModal('score-breakdown', { analysis: assignment.professorAnalysis, onFix: handleFixWeakness })} className="relative h-24 w-24 cursor-pointer group flex-shrink-0">
                                            <svg className="h-full w-full" viewBox="0 0 36 36">
                                                <path className="text-gray-200 dark:text-gray-700" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path className={getScoreColor(assignment.professorAnalysis.rating)} strokeWidth="3" strokeDasharray={`${assignment.professorAnalysis.rating}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform group-hover:scale-110">
                                                <span className="text-2xl font-bold">{assignment.professorAnalysis.rating}</span>
                                                <span className="text-xs text-gray-500">Score</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{assignment.professorAnalysis.name}</p>
                                            <p className="text-sm text-gray-500">{assignment.professorAnalysis.personality}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mt-4">Key Goals:</h3>
                                        <ul className="list-disc list-inside space-y-1 text-sm mt-2 text-gray-600 dark:text-gray-400">
                                            {assignment.professorAnalysis.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-gray-500 text-sm mb-4">Analyze professor to get personalized tips and a compliance rating.</p>
                                    <button onClick={handleAnalyzeProfessor} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Analyze Professor & Syllabus</button>
                                </div>
                            )
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default AssignmentDetail;

