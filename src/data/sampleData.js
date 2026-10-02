// Realistic starter data so the app doesn't look empty on first load.
// This only gets used the very first time the app runs — after that,
// whatever the user creates/edits lives in localStorage instead.

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export const sampleTasks = [
  {
    id: 't1',
    title: 'Finalize IntelliHub project proposal',
    description: 'Compile the architecture diagram and feature list for the coordinator review.',
    priority: 'high',
    dueDate: daysFromNow(1),
    completed: false,
    createdAt: daysFromNow(-4),
    completedAt: null,
  },
  {
    id: 't2',
    title: 'Design database schema',
    description: 'Draft the MySQL schema for tasks, documents and users ahead of the backend phase.',
    priority: 'high',
    dueDate: daysFromNow(3),
    completed: false,
    createdAt: daysFromNow(-3),
    completedAt: null,
  },
  {
    id: 't3',
    title: 'Set up React + Vite project',
    description: 'Scaffold the frontend and confirm the dev server runs.',
    priority: 'medium',
    dueDate: daysFromNow(-1),
    completed: true,
    createdAt: daysFromNow(-5),
    completedAt: daysFromNow(-2),
  },
  {
    id: 't4',
    title: 'Research JWT authentication flow',
    description: 'Read up on Spring Security + JWT before implementing the auth module.',
    priority: 'medium',
    dueDate: daysFromNow(6),
    completed: false,
    createdAt: daysFromNow(-2),
    completedAt: null,
  },
  {
    id: 't5',
    title: 'Sketch dashboard wireframes',
    description: 'Low-fidelity sketches for the dashboard and tasks page layout.',
    priority: 'low',
    dueDate: daysFromNow(-3),
    completed: true,
    createdAt: daysFromNow(-6),
    completedAt: daysFromNow(-4),
  },
  {
    id: 't6',
    title: 'Prepare mid-term presentation slides',
    description: 'Cover project vision, current progress and the roadmap for remaining phases.',
    priority: 'high',
    dueDate: daysFromNow(2),
    completed: false,
    createdAt: daysFromNow(-1),
    completedAt: null,
  },
  {
    id: 't7',
    title: 'Read scikit-learn getting started guide',
    description: 'Background reading for the productivity-prediction ML module.',
    priority: 'low',
    dueDate: daysFromNow(9),
    completed: false,
    createdAt: daysFromNow(-1),
    completedAt: null,
  },
];

// Note: documents no longer carry a hardcoded "status" field. Whether
// a document is registered/verified is now derived from the ledger in
// blockchainUtils.js — documentHash and blockIndex get filled in once
// a document is registered onto the chain.
//
// `source: 'sample'` marks these as seed data with no real file behind
// them — their hash comes from metadata, not real file bytes. Real
// uploads (added via the file picker) are tagged `source: 'upload'`.
export const sampleDocuments = [
  {
    id: 'd1',
    name: 'Project Proposal.pdf',
    type: 'PDF',
    uploadDate: daysFromNow(-5),
    documentHash: null,
    blockIndex: null,
    source: 'sample',
  },
  {
    id: 'd2',
    name: 'System Architecture.png',
    type: 'PNG',
    uploadDate: daysFromNow(-3),
    documentHash: null,
    blockIndex: null,
    source: 'sample',
  },
  {
    id: 'd3',
    name: 'Database Schema Draft.docx',
    type: 'DOCX',
    uploadDate: daysFromNow(-1),
    documentHash: null,
    blockIndex: null,
    source: 'sample',
  },
  {
    id: 'd4',
    name: 'Sprint Notes.txt',
    type: 'TXT',
    uploadDate: daysFromNow(0),
    documentHash: null,
    blockIndex: null,
    source: 'sample',
  },
];
