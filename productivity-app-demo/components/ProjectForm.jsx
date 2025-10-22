// File: src/components/ProjectForm.jsx
import React, { useState } from 'react';
import { MOCK_USER, ALL_USERS, createInitialProfessorAnalysis } from '../api/constants';
import { XIcon } from './shared/Icons';

function ProjectForm({ project, onSave, onCancel, mode }) {
    const [title, setTitle] = useState(project?.title || '');
    const [course, setCourse] = useState(project?.course || '');
    const [dueDate, setDueDate] = useState(project?.dueDate || '');
    const [description, setDescription] = useState(project?.description || '');
    const [members, setMembers] = useState(project?.members || [MOCK_USER]);
    const [memberSearch, setMemberSearch] = useState('');

    const availableUsers = ALL_USERS.filter(u => !members.some(m => m.id === u.id));

    const handleAddMember = (user) => { setMembers([...members, user]); setMemberSearch(''); };
    const handleRemoveMember = (userId) => { if (userId === MOCK_USER.id) return; setMembers(members.filter(m => m.id !== userId)); };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProjectData = { id: project?.id || Date.now(), title, course, dueDate, description };
        if (mode === 'individual') {
            newProjectData.tasks = project?.tasks || [];
            newProjectData.totalEta = project?.totalEta || 0;
            newProjectData.professorAnalysis = project?.professorAnalysis || createInitialProfessorAnalysis();
            newProjectData.source = project?.source || 'manual';
        } else {
            newProjectData.members = members;
            newProjectData.tasks = project?.tasks || [];
            newProjectData.meetings = project?.meetings || [];
            newProjectData.versions = project?.versions || { 'main': [{ id: `c${Date.now()}`, message: 'Initial project creation', author: MOCK_USER.name, timestamp: 'Just now'}] };
            newProjectData.activeBranch = project?.activeBranch || 'main';
        }
        onSave(newProjectData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" /></div>
            <div><label className="block text-sm font-medium">Course</label><input type="text" value={course} onChange={e => setCourse(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" /></div>
            <div><label className="block text-sm font-medium">Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" /></div>
            {mode === 'individual' && (
                 <div><label className="block text-sm font-medium">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" /></div>
            )}
            {mode === 'group' && (
                <div>
                    <label className="block text-sm font-medium">Team Members</label>
                    <div className="flex flex-wrap gap-2 p-2 mt-1 border rounded-md dark:border-gray-600 min-h-[40px]">{members.map(m => <div key={m.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-600 rounded-full px-2 py-1 text-sm">{m.name} {m.id !== MOCK_USER.id && <button type="button" onClick={() => handleRemoveMember(m.id)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"><XIcon className="w-3 h-3"/></button>}</div>)}</div>
                    <div className="relative mt-2">
                        <input type="text" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Add member by name..." className="w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                        {memberSearch && availableUsers.filter(u => u.name.toLowerCase().includes(memberSearch.toLowerCase())).length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">{availableUsers.filter(u => u.name.toLowerCase().includes(memberSearch.toLowerCase())).map(u => <div key={u.id} onClick={() => handleAddMember(u)} className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">{u.name}</div>)}</div>
                        )}
                    </div>
                </div>
            )}
            <div className="flex justify-end gap-2 pt-4"><button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-md border">Cancel</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Project</button></div>
        </form>
    );
}

export default ProjectForm;

