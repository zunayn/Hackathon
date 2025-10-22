// File: src/api/mockApi.js
export const mockCanvasAPI = {
    getCourses: () => new Promise(resolve => setTimeout(() => resolve([
        { id: 'canvas_c_1', name: 'HIST221 - American History', professor: 'Dr. Eleanor Vance' },
        { id: 'canvas_c_2', name: 'PHIL305 - Ethics', professor: 'Dr. Marcus Thorne' },
    ]), 1000)),
    getAssignments: (courseId) => new Promise(resolve => {
        const assignments = {
            'canvas_c_1': [{ id: 'canvas_a_1', name: 'Civil War Essay', description: 'A 10-page research paper on the economic causes of the American Civil War.', due_at: '2025-11-20T23:59:00Z' }],
            'canvas_c_2': [{ id: 'canvas_a_2', name: 'Utilitarianism Paper', description: 'Analyze and critique John Stuart Mill\'s theory of Utilitarianism in a 5-page paper.', due_at: '2025-12-05T23:59:00Z' }],
        };
        setTimeout(() => resolve(assignments[courseId] || []), 500);
    }),
};

export const mockCalendarAPI = {
    getEvents: () => new Promise(resolve => setTimeout(() => resolve([
        { id: 'cal_e_1', title: 'CS101 Study Session', start: '2025-11-10T14:00:00Z', end: '2025-11-10T16:00:00Z' },
        { id: 'cal_e_2', title: 'Team Meeting: Startup Pitch', start: '2025-11-12T10:00:00Z', end: '2025-11-12T11:00:00Z' },
        { id: 'cal_e_3', title: 'Submit Philosophy Paper Draft', start: '2025-12-04T23:59:00Z', end: '2025-12-04T23:59:00Z' }
    ]), 1200)),
};

export const mockCrawlerAPI = {
    analyzeProfessor: (professorName) => new Promise(resolve => setTimeout(() => {
        const mockAnalyses = {
            'Dr. Eleanor Vance': { name: 'Dr. Eleanor Vance', personality: "Detail-oriented historian. Values primary sources and clear, chronological arguments. Known for being a tough but fair grader.", rating: 85, tips: ["Cite everything using Chicago style.", "Integrate at least 3 primary source documents.", "Proofread for historical accuracy."], strengths: ["Outline follows a logical chronological order."], weaknesses: ["Missing a dedicated section for primary source analysis."], resources: [{name: "History Dept. Writing Guide", url:"#"}] },
            'Dr. Marcus Thorne': { name: 'Dr. Marcus Thorne', personality: "Focuses on logical consistency and ethical reasoning. Appreciates novel arguments but demands they are well-defended.", rating: 92, tips: ["Clearly define all philosophical terms.", "Address potential counter-arguments directly.", "Structure your paper around a single, strong thesis."], strengths: ["Strong thesis statement.", "Clear definitions of key terms."], weaknesses: ["Counter-arguments are not fully addressed in the outline."], resources: [{name: "Stanford Encyclopedia of Philosophy", url:"#"}] },
            'default': { name: professorName, personality: "General academic standards apply. Focus on clarity, structure, and proper citations.", rating: 78, tips: ["Follow the rubric closely.", "Visit office hours to clarify questions.", "Submit one day early to avoid technical issues."], strengths: ["Plan covers all rubric items."], weaknesses: ["Timeline is a bit tight; consider adding buffer days."], resources: [] }
        };
        resolve(mockAnalyses[professorName] || mockAnalyses['default']);
    }, 2500)),
};

