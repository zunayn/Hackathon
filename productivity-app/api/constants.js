// File: src/api/constants.js

// --- Mock Data ---
export const MOCK_USER = { id: 1, name: 'Alex Doe', email: 'alex@university.edu', avatar: 'https://placehold.co/100x100/e2e8f0/4a5568?text=AD' };

export const ALL_USERS = [
    MOCK_USER,
    { id: 2, name: 'Brenda Smith', avatar: 'https://placehold.co/100x100/e2e8f0/4a5568?text=BS' },
    { id: 3, name: 'Charles Green', avatar: 'https://placehold.co/100x100/e2e8f0/4a5568?text=CG' },
    { id: 4, name: 'Diana Prince', avatar: 'https://placehold.co/100x100/e2e8f0/4a5568?text=DP' },
    { id: 5, name: 'Edward Johnson', avatar: 'https://placehold.co/100x100/e2e8f0/4a5568?text=EJ' },
];

// --- Helper Functions for Mock Data ---
export const createNewTask = (text, eta) => ({ id: Date.now() + Math.random(), text, completed: false, eta });

export const createInitialProfessorAnalysis = () => ({ 
    name: 'Prof. TBD', 
    personality: 'Analysis pending...', 
    rating: 0, 
    tips: [], 
    strengths: [], 
    weaknesses: [], 
    resources: [] 
});

// --- Initial Mock Data Arrays ---
export const initialMockAssignments = [
    { 
        id: 1, 
        course: 'CS101', 
        title: 'Algorithm Visualizer', 
        description: 'Design and build an interactive web application to visualize common sorting algorithms like Bubble Sort, Merge Sort, and Quick Sort.', 
        dueDate: '2025-11-15', 
        totalEta: 12.5, 
        tasks: [
            createNewTask('Setup project boilerplate', 1), 
            createNewTask('Implement sorting algorithm', 4)
        ], 
        professorAnalysis: { 
            name: 'Dr. Evelyn Reed', 
            personality: 'Values clarity & well-documented code.', 
            rating: 88, 
            tips: ['Add comments to your code.', 'Ensure the UI is intuitive.', 'Write clean, efficient algorithms.'], 
            strengths: ['Project has a clear structure.'], 
            weaknesses: ['Initial task breakdown is too generic.'] 
        }, 
        source: 'manual' 
    },
];

export const initialMockGroupProjects = [
    { 
        id: 101, 
        title: 'Startup Pitch Deck', 
        course: 'BUS301', 
        members: [MOCK_USER, ALL_USERS[1]], 
        tasks: [{ id: 1, text: 'Market Research', assignedTo: ALL_USERS[1].id, completed: true }], 
        meetings: [], 
        versions: { 'main': [{ id: 'c1', message: 'Initial project setup', author: 'Alex Doe', timestamp: '1 week ago' }] }, 
        activeBranch: 'main' 
    }
];

