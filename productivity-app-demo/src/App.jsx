// File: src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import AuthScreen from './components/AuthScreen';
import AssignmentDetail from './components/AssignmentDetail';
import GroupProjectView from './components/GroupProjectView';
import AiPlannerModal from './components/AiPlannerModal';
import BranchManagerModal from './components/BranchManagerModal';
import ScoreBreakdownModal from './components/ScoreBreakdownModal';
import ProjectForm from './components/ProjectForm';
import Modal from './components/shared/Modal';
import Card from './components/shared/Card';
import ProgressBar from './components/shared/ProgressBar';
import { BrainCircuitIcon, CalendarIcon, RefreshCwIcon } from './components/shared/Icons';
import { mockCanvasAPI, mockCalendarAPI } from './api/mockApi';
import { initialMockAssignments, initialMockGroupProjects, createNewTask, createInitialProfessorAnalysis, MOCK_USER } from './api/constants'; // Added MOCK_USER


export default function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState('auth'); // auth, dashboard, individual-detail, group-detail
    const [selectedItem, setSelectedItem] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [assignments, setAssignments] = useState(initialMockAssignments);
    const [groupProjects, setGroupProjects] = useState(initialMockGroupProjects);
    const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
    const [isSyncingCanvas, setIsSyncingCanvas] = useState(false);
    const [canvasSynced, setCanvasSynced] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
    const [calendarSynced, setCalendarSynced] = useState(false);
    const [activeMode, setActiveMode] = useState('individual'); // 'individual' or 'group'

    useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

    const unplannedAssignments = useMemo(() => assignments.filter(a => a.tasks.length <= 1), [assignments]);
    const inProgressAssignments = useMemo(() => assignments.filter(a => a.tasks.length > 1), [assignments]);

    // Update login to use MOCK_USER from constants
    const handleLogin = () => { setUser(MOCK_USER); setView('dashboard'); };
    const handleLogout = () => { setUser(null); setView('auth'); setAssignments(initialMockAssignments); setGroupProjects(initialMockGroupProjects); setCalendarEvents([]); setCanvasSynced(false); setCalendarSynced(false); };
    const navigate = (newView, data = null) => { setSelectedItem(data); setView(newView); };

    const handleUpdateAssignment = (updatedAssignment) => { setAssignments(prev => prev.map(a => a.id === updatedAssignment.id ? updatedAssignment : a)); setSelectedItem(updatedAssignment); };
    const handleUpdateGroupProject = (updatedProject) => { setGroupProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p)); setSelectedItem(updatedProject); };

    const handleOpenModal = (type, data = null) => {
        // If opening score breakdown, ensure data is passed correctly
        if (type === 'score-breakdown' && data && data.analysis) {
            setModalState({ isOpen: true, type, data: { analysis: data.analysis, onFix: data.onFix } });
        } else {
            setModalState({ isOpen: true, type, data });
        }
    };
    const handleCloseModal = () => setModalState({ isOpen: false, type: null, data: null });

    const handleSaveProject = (projectData) => {
        const { type } = modalState;
        if (type.includes('individual')) {
            if (type.includes('create')) setAssignments(prev => [...prev, projectData]);
            else handleUpdateAssignment(projectData);
        } else { // group
            if (type.includes('create')) setGroupProjects(prev => [...prev, projectData]);
            else handleUpdateGroupProject(projectData);
        }
        handleCloseModal();
    };

    const handleAiPlanUpdate = (plannedAssignment) => {
        handleUpdateAssignment(plannedAssignment);
        handleCloseModal();
    };

    const handleDeleteAssignment = (id) => { if (window.confirm('Are you sure?')) setAssignments(prev => prev.filter(a => a.id !== id)); };
    const handleDeleteGroupProject = (id) => { if (window.confirm('Are you sure?')) setGroupProjects(prev => prev.filter(p => p.id !== id)); };

    const handleSyncCanvas = async () => {
        setIsSyncingCanvas(true);
        const courses = await mockCanvasAPI.getCourses();
        const allAssignments = await Promise.all(
            courses.map(course => mockCanvasAPI.getAssignments(course.id).then(asg => asg.map(a => ({...a, courseName: course.name, professor: course.professor}))))
        );
        
        const newAssignments = allAssignments.flat().map(a => ({
            id: a.id,
            course: a.courseName,
            title: a.name,
            description: a.description,
            dueDate: a.due_at.split('T')[0],
            tasks: [createNewTask('Complete assignment', 0)], // Default task with 0 eta to signify unplanned
            totalEta: 0,
            professorAnalysis: createInitialProfessorAnalysis(),
            professorName: a.professor,
            source: 'canvas',
        }));
        
        setAssignments(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const uniqueNew = newAssignments.map(a => ({ ...a, professorAnalysis: { ...createInitialProfessorAnalysis(), name: a.professorName } }));
            const filteredNew = uniqueNew.filter(a => !existingIds.has(a.id));
            return [...prev, ...filteredNew];
        });

        setIsSyncingCanvas(false);
        setCanvasSynced(true);
    };

    const handleSyncCalendar = async () => {
        setIsSyncingCalendar(true);
        const events = await mockCalendarAPI.getEvents();
        const formattedEvents = events.map(e => ({
            id: e.id,
            title: e.title,
            date: new Date(e.start).toISOString().split('T')[0],
            time: new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            source: 'calendar'
        }));

        setCalendarEvents(prev => {
            const existingIds = new Set(prev.map(evt => evt.id));
            const uniqueNew = formattedEvents.filter(evt => !existingIds.has(evt.id));
            return [...prev, ...uniqueNew];
        });

        setIsSyncingCalendar(false);
        setCalendarSynced(true);
    };

    const renderModalContent = () => {
        const { type, data } = modalState;
        if (type === 'create-ai') return <AiPlannerModal assignments={unplannedAssignments} onSavePlan={handleAiPlanUpdate} onCancel={handleCloseModal} />;
        if (type === 'create-individual') return <ProjectForm onSave={handleSaveProject} onCancel={handleCloseModal} mode="individual" />;
        if (type === 'create-group') return <ProjectForm onSave={handleSaveProject} onCancel={handleCloseModal} mode="group" />;
        if (type === 'update-individual') return <ProjectForm project={data} onSave={handleSaveProject} onCancel={handleCloseModal} mode="individual" />;
        if (type === 'update-group') return <ProjectForm project={data} onSave={handleSaveProject} onCancel={handleCloseModal} mode="group" />;
        if (type === 'manage-branches') return <BranchManagerModal isOpen={modalState.isOpen} onClose={handleCloseModal} versions={data.versions} onBranchUpdate={data.onBranchUpdate} />;
        // Pass the onFix handler correctly
        if (type === 'score-breakdown') return <ScoreBreakdownModal analysis={data.analysis} onFix={data.onFix} onClose={handleCloseModal} />;
        return null;
    };

    const renderMainContent = () => {
        if (view === 'individual-detail') return <AssignmentDetail assignment={selectedItem} onBack={() => navigate('dashboard')} onUpdate={handleUpdateAssignment} onOpenModal={handleOpenModal} />;
        if (view === 'group-detail') return <GroupProjectView project={selectedItem} onBack={() => navigate('dashboard')} onUpdateProject={handleUpdateGroupProject} user={user} onOpenModal={handleOpenModal} calendarEvents={calendarEvents} />;

        // Main Dashboard View
        return (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     <div>
                        <h1 className="text-3xl font-bold">Welcome, {user.name.split(' ')[0]}!</h1>
                        <p className="text-gray-500 mt-1">Here's your dashboard for today.</p>
                     </div>

                    <div className="flex border-b dark:border-gray-700">
                        <button onClick={() => setActiveMode('individual')} className={`px-4 py-2 text-sm font-semibold ${activeMode === 'individual' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Individual</button>
                        <button onClick={() => setActiveMode('group')} className={`px-4 py-2 text-sm font-semibold ${activeMode === 'group' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Group</button>
                    </div>

                    {inProgressAssignments.length > 0 && activeMode === 'individual' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold">Continue Your Work</h2>
                            <div className="space-y-3">
                                {inProgressAssignments.map(a => {
                                    const completedEta = a.tasks.filter(t => t.completed).reduce((sum, task) => sum + (task.eta || 0), 0);
                                    const progress = a.totalEta > 0 ? (completedEta / a.totalEta) * 100 : 0;
                                    return (
                                        <div key={a.id} onClick={() => navigate('individual-detail', a)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold">{a.title}</h3>
                                                <span className="text-xs font-medium text-gray-500">{a.course}</span>
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>Progress</span>
                                                    <span>{Math.round(progress)}%</span>
                                                </div>
                                                <ProgressBar value={progress} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">{activeMode === 'individual' ? 'All Individual Projects' : 'All Group Projects'}</h2>
                            <button onClick={() => handleOpenModal(activeMode === 'individual' ? 'create-individual' : 'create-group')} className="text-sm font-semibold text-blue-600 hover:underline">Add New</button>
                        </div>
                        <div className="space-y-3">
                           {activeMode === 'individual' ? 
                             assignments.map(a => (
                                <div key={a.id} onClick={() => navigate('individual-detail', a)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center">
                                     <div>
                                         <h3 className="font-semibold">{a.title}</h3>
                                         <p className="text-sm text-gray-500">{a.course} &bull; Due: {a.dueDate}</p>
                                     </div>
                                      {a.tasks.length > 1 && <span className="text-xs bg-green-100 text-green-800 font-medium px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">In Progress</span>}
                                </div>
                             )) : 
                             groupProjects.map(p => (
                                <div key={p.id} onClick={() => navigate('group-detail', p)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center">
                                    <div>
                                         <h3 className="font-semibold">{p.title}</h3>
                                         <p className="text-sm text-gray-500">{p.course} &bull; {p.members.length} members</p>
                                     </div>
                                     <div className="flex -space-x-2">{p.members.slice(0,3).map(m => <img key={m.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800" src={m.avatar} alt={m.name} />)}</div>
                                </div>
                             ))
                           }
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
                         <button onClick={() => handleOpenModal('create-ai')} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                             <BrainCircuitIcon className="w-6 h-6 text-blue-500" />
                             <div>
                                 <h3 className="font-semibold">Create with AI</h3>
                                 <p className="text-xs text-gray-500">Let AI jumpstart your project plan.</p>
                             </div>
                         </button>
                         <div className="border-t dark:border-gray-700"></div>
                         <button onClick={handleSyncCanvas} disabled={isSyncingCanvas || canvasSynced} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50">
                             <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15l-4-4h3V9h2v4h3l-4 4z"></path></svg>
                             <div>
                                 <h3 className="font-semibold">Connect to Canvas</h3>
                                 <p className="text-xs text-gray-500">{isSyncingCanvas ? 'Syncing...' : (canvasSynced ? 'Synced ✓' : 'Import your assignments.')}</p>
                             </div>
                         </button>
                          <div className="border-t dark:border-gray-700"></div>
                         <button onClick={handleSyncCalendar} disabled={isSyncingCalendar || calendarSynced} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50">
                             <CalendarIcon className="w-6 h-6 text-indigo-500" />
                             <div>
                                 <h3 className="font-semibold">Connect to Calendar</h3>
                                 <p className="text-xs text-gray-500">{isSyncingCalendar ? 'Syncing...' : (calendarSynced ? 'Synced ✓' : 'Import your events.')}</p>
                             </div>
                         </button>
                    </div>
                </div>
             </div>
        );
    };

    if (!user) {
        return (
            <div className={darkMode ? 'dark' : ''}>
                 <AuthScreen onLogin={handleLogin} />
            </div>
        )
    }

    return (
        <div className={darkMode ? 'dark' : ''}>
            <Modal isOpen={modalState.isOpen} onClose={handleCloseModal} title={
                modalState.type === 'create-ai' ? 'AI Project Planner' : 
                modalState.type === 'manage-branches' ? 'Manage Branches' : 
                modalState.type === 'score-breakdown' ? 'Compliance Score Breakdown' :
                modalState.type?.includes('create') ? 'Create New Project' : 'Edit Project'
            }>
                {renderModalContent()}
            </Modal>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between items-center py-3"><h1 className="text-xl font-bold tracking-tight">Academi<span className="text-blue-500">Git</span></h1><div className="flex items-center gap-4"><button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">{darkMode ? '☀️' : '🌙'}</button><span className="text-sm">|</span><span className="text-sm">{user.name}</span><button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700">Logout</button></div></div></div></header>
                <main className="py-10"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{renderMainContent()}</div></main>
            </div>
        </div>
    );
}
