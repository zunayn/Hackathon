// File: src/components/BranchManagerModal.jsx
import React, { useState } from 'react';
import Modal from './shared/Modal';
import { EditIcon, Trash2Icon } from './shared/Icons';

function BranchManagerModal({ isOpen, onClose, versions, onBranchUpdate }) {
    const [newBranchName, setNewBranchName] = useState('');

    const handleCreateBranch = (e) => {
        e.preventDefault();
        const sanitizedName = newBranchName.trim().replace(/\s+/g, '-');
        if (!sanitizedName || versions[sanitizedName]) {
            alert('Invalid or duplicate branch name.');
            return;
        }
        const updatedVersions = { ...versions, [sanitizedName]: versions['main'] || [] };
        onBranchUpdate(updatedVersions, sanitizedName);
        setNewBranchName('');
    };

    const handleDeleteBranch = (branchName) => {
        if (branchName === 'main') {
            alert("Cannot delete the 'main' branch.");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the branch "${branchName}"?`)) {
            const { [branchName]: deleted, ...remainingVersions } = versions;
            onBranchUpdate(remainingVersions, 'main');
        }
    };
    
    // Simple rename via prompt
    const handleRenameBranch = (oldName) => {
        if (oldName === 'main') {
            alert("Cannot rename the 'main' branch.");
            return;
        }
        const newName = window.prompt(`Enter new name for branch "${oldName}":`, oldName);
        const sanitizedName = newName?.trim().replace(/\s+/g, '-');
        if (!sanitizedName || versions[sanitizedName]) {
            alert('Invalid or duplicate branch name.');
            return;
        }
        const { [oldName]: content, ...remainingVersions } = versions;
        const updatedVersions = { ...remainingVersions, [sanitizedName]: content };
        onBranchUpdate(updatedVersions, sanitizedName);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Branches">
            <div className="space-y-4">
                <form onSubmit={handleCreateBranch} className="space-y-2">
                     <label className="block text-sm font-medium">Create New Branch</label>
                     <div className="flex gap-2">
                        <input type="text" value={newBranchName} onChange={e => setNewBranchName(e.target.value)} placeholder="new-feature-branch" className="flex-grow rounded-md dark:bg-gray-700"/>
                        <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md">Create</button>
                     </div>
                </form>

                <div className="space-y-2 pt-4 border-t dark:border-gray-700">
                    <h3 className="font-semibold">Existing Branches</h3>
                     <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {Object.keys(versions).map(branch => (
                            <li key={branch} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <span>{branch}</span>
                                {branch !== 'main' && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleRenameBranch(branch)} className="p-1"><EditIcon className="w-4 h-4 text-gray-400 hover:text-blue-500"/></button>
                                        <button onClick={() => handleDeleteBranch(branch)} className="p-1"><Trash2Icon className="w-4 h-4 text-gray-400 hover:text-red-500"/></button>
                                    </div>
                                )}
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </Modal>
    );
}

export default BranchManagerModal;

