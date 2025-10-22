// File: src/components/GroupProjectView.jsx
import React, { useState, useMemo } from 'react';
// If you use ALL_USERS or shared components, ensure their imports exist and match your folders:
// import { ALL_USERS } from '@/api/constants';
// import Card from '@/components/shared/Card';
// import ProgressBar from '@/components/shared/ProgressBar';
// import {
//   MessageSquareIcon,
//   GitBranchIcon,
//   CheckCircleIcon,
//   PlusCircleIcon,
//   CalendarIcon,
//   EditIcon,
// } from '@/components/shared/Icons';
// import { ALL_USERS } from '@/api/constants';

function GroupProjectView({ project, onBack, onUpdateProject, user, onOpenModal, calendarEvents }) {
    const [naturalInput, setNaturalInput] = useState('');
    const [activeBranch, setActiveBranch] = useState(project.activeBranch);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isConfirmingUpdate, setIsConfirmingUpdate] = useState(false);
    
    const handleNaturalLanguageSubmit = (e) => { e.preventDefault(); if (!naturalInput) return; const newTask = { id: Date.now(), text: `(Parsed from NL): "${naturalInput}"`, assignedTo: project.members[Math.floor(Math.random() * project.members.length)].id, completed: false }; onUpdateProject({ ...project, tasks: [...project.tasks, newTask] }); setHasUnsavedChanges(true); setNaturalInput(''); };
    const handleConfirmUpdate = () => { 
        const message = window.prompt("Enter a brief description of your changes:"); 
        if (!message) return; 
        const newUpdate = { id: `c${Date.now()}`, message, author: user.name, timestamp: 'Just now' }; 
        const updatedVersions = { ...project.versions, [activeBranch]: [newUpdate, ...(project.versions[activeBranch] || [])] }; 
        onUpdateProject({ ...project, versions: updatedVersions }); 
        setHasUnsavedChanges(false); 
        setIsConfirmingUpdate(false); 
    };
    const handleCancelUpdate = () => { 
        setIsConfirmingUpdate(false); 
    };
    
    const handleToggleTask = (taskId) => { 
        onUpdateProject({ ...project, tasks: project.tasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t) }); 
        setHasUnsavedChanges(true); 
    };
    
    const handleBranchUpdate = (newVersions, newActiveBranch) => { onUpdateProject({...project, versions: newVersions, activeBranch: newActiveBranch || activeBranch}); };
    
    const getMemberById = (id) => ALL_USERS.find(m => m.id === id);
    const memberProgress = useMemo(() => project.members.map(member => { const memberTasks = project.tasks.filter(t => t.assignedTo === member.id); if (memberTasks.length === 0) return null; const completed = memberTasks.filter(t => t.completed).length; return { ...member, completed, total: memberTasks.length, progress: (completed / memberTasks.length) * 100 }; }).filter(Boolean), [project.tasks, project.members]);
    
    const projectRelatedEvents = useMemo(() => calendarEvents.filter(event => event.title.toLowerCase().includes(project.title.toLowerCase()) || event.title.toLowerCase().includes(project.course.toLowerCase())), [calendarEvents, project.title, project.course]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div><button onClick={onBack} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 mb-4">← Back to Projects</button><p className="font-semibold text-green-500 dark:text-green-400">{project.course}</p><h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{project.title}</h1></div>
                <button onClick={() => onOpenModal('update-group', project)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"><EditIcon className="w-5 h-5 text-gray-500"/></button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card><h2 className="text-xl font-bold flex items-center gap-2"><MessageSquareIcon className="w-6 h-6" /> Natural Language Tasking</h2><form onSubmit={handleNaturalLanguageSubmit} className="flex gap-2 mt-4"><input type="text" value={naturalInput} onChange={(e) => setNaturalInput(e.target.value)} placeholder="e.g., Have Brenda research competitor pricing..." className="flex-grow px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" /><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Assign</button></form></Card>
                    <Card><h2 className="text-xl font-bold">Task Board</h2><ul className="space-y-2 mt-4">{project.tasks.map(task => { const assignee = getMemberById(task.assignedTo); return (<li key={task.id} className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"><div className="flex items-center"><input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>{task.text}</span></div><div className="flex items-center gap-2"><span className="text-xs font-medium text-gray-500">{assignee?.name.split(' ')[0]}</span><img src={assignee?.avatar} alt={assignee?.name} className="h-6 w-6 rounded-full"/></div></li>);})}</ul></Card>
                    <Card>
                        <h2 className="text-xl font-bold flex items-center gap-2"><GitBranchIcon className="w-6 h-6" /> Version Control</h2>
                        <div className="mt-4 flex justify-between items-center">
                            <div><span className="text-sm font-medium">Active Branch: </span><select value={activeBranch} onChange={e => setActiveBranch(e.target.value)} className="p-1 rounded-md bg-gray-100 dark:bg-gray-700">{Object.keys(project.versions).map(branch => <option key={branch} value={branch}>{branch}</option>)}</select></div>
                            <button onClick={() => onOpenModal('manage-branches', { versions: project.versions, onBranchUpdate: handleBranchUpdate })} className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/50">Manage Branches</button>
                        </div>
                        <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2 border-b dark:border-gray-700 pb-4 mb-4">{(project.versions[activeBranch] || []).map(update => (<div key={update.id} className="flex items-start gap-3"><CheckCircleIcon className="w-5 h-5 mt-0.5 text-green-500 shrink-0" /><div><p className="font-medium text-gray-800 dark:text-gray-200">{update.message}</p><p className="text-sm text-gray-500">{update.author} updated {update.timestamp}</p></div></div>))}</div>
                        
                        <div className="mt-4">
                            {hasUnsavedChanges ? (
                                isConfirmingUpdate ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={handleCancelUpdate} className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Revert Changes</button>
                                        <button onClick={handleConfirmUpdate} className="w-full py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Confirm Changes</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsConfirmingUpdate(true)} className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Update your teammates about this change</button>
                                )
                            ) : (
                                <p className="text-sm text-center text-gray-500">No new changes to update.</p>
                            )}
                        </div>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card><h2 className="text-lg font-bold">Team Progress</h2><div className="space-y-4 mt-4">{memberProgress.map(member => (<div key={member.id}><div className="flex justify-between items-center"><div className="flex items-center gap-2"><img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full" /><span className="font-medium text-gray-800 dark:text-gray-200">{member.name}</span></div><span className="text-sm text-gray-500">{member.completed}/{member.total}</span></div><ProgressBar value={member.progress} className="mt-1.5" /></div>))}</div></Card>
                    <Card>
                        <h2 className="text-lg font-bold">Meetings & Deadlines</h2>
                        <ul className="space-y-3 mt-4">
                            {[...(project.meetings || []), ...projectRelatedEvents].map((meeting, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CalendarIcon className="w-5 h-5 mt-0.5 text-blue-500 shrink-0"/>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{meeting.topic || meeting.title}</p>
                                        <p className="text-sm text-gray-500">{meeting.date} @ {meeting.time}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full mt-4 text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-md py-2 hover:bg-gray-900 dark:hover:bg-gray-600 flex items-center justify-center gap-2"><PlusCircleIcon className="w-5 h-5"/> Schedule New Meeting</button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
export default GroupProjectView;

