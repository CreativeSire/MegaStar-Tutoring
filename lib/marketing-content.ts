export const marketRegions = [
  "UK",
  "Nigeria",
  "Germany",
  "Spain",
  "Mauritius",
  "France",
  "US",
  "Canada",
];

export const gatewayPages = [
  {
    href: "/subjects",
    label: "Subjects",
    title: "Explore the full curriculum",
    description:
      "Browse the core subjects, exam boards, and language paths in one dedicated place.",
    image: "/visuals/subject-math.svg",
  },
  {
    href: "/how-it-works",
    label: "How it works",
    title: "See the learning flow",
    description:
      "Read the full journey from assessment to live lesson to archive and follow-up.",
    image: "/visuals/hero-classroom.svg",
  },
  {
    href: "/tutors",
    label: "Tutors",
    title: "Meet the teaching team",
    description:
      "See the tutors, specialisms, and screening standard behind the classroom.",
    image: "/visuals/tutor-james.svg",
  },
  {
    href: "/pricing",
    label: "Pricing",
    title: "Understand the plans",
    description:
      "Check the packages, premium workflow, and regional support at a glance.",
    image: "/visuals/subject-english.svg",
  },
];

export const subjectShowcase = [
  { name: "Mathematics", students: 1240, image: "/visuals/subject-math.svg", accent: "#6366f1", note: "Number confidence" },
  { name: "English", students: 980, image: "/visuals/subject-english.svg", accent: "#8b5cf6", note: "Reading and writing" },
  { name: "Physics", students: 756, image: "/visuals/subject-physics.svg", accent: "#06b6d4", note: "Concepts that click" },
  { name: "Chemistry", students: 642, image: "/visuals/subject-chemistry.svg", accent: "#10b981", note: "See the reaction" },
  { name: "Biology", students: 589, image: "/visuals/subject-biology.svg", accent: "#84cc16", note: "Life and systems" },
  { name: "History", students: 423, image: "/visuals/subject-history.svg", accent: "#f59e0b", note: "Stories that stay" },
  { name: "Geography", students: 387, image: "/visuals/subject-geography.svg", accent: "#3b82f6", note: "World view" },
  { name: "French", students: 298, image: "/visuals/subject-french.svg", accent: "#ef4444", note: "Speak with ease" },
  { name: "Spanish", students: 267, image: "/visuals/subject-spanish.svg", accent: "#f97316", note: "Build fluency" },
  { name: "Computer Science", students: 534, image: "/visuals/subject-cs.svg", accent: "#14b8a6", note: "Code with confidence" },
  { name: "Economics", students: 312, image: "/visuals/subject-econ.svg", accent: "#6366f1", note: "Think analytically" },
  { name: "Psychology", students: 245, image: "/visuals/subject-psych.svg", accent: "#ec4899", note: "Understand people" },
];

export const subjectRoutes = [
  {
    href: "/subjects/mathematics",
    title: "Mathematics",
    summary: "GCSE, A-Level, exam confidence, and problem-solving that stays calm.",
    image: "/visuals/subject-math.svg",
    accent: "#6366f1",
  },
  {
    href: "/subjects/science",
    title: "Science",
    summary: "Physics, chemistry, biology, and practical explanations that click faster.",
    image: "/visuals/subject-physics.svg",
    accent: "#06b6d4",
  },
  {
    href: "/subjects/languages",
    title: "Languages",
    summary: "French and Spanish pathways with speaking confidence and exam structure.",
    image: "/visuals/subject-spanish.svg",
    accent: "#f97316",
  },
  {
    href: "/subjects/english",
    title: "English",
    summary: "Reading, writing, comprehension, and essay flow with less friction.",
    image: "/visuals/subject-english.svg",
    accent: "#8b5cf6",
  },
];

export const subjectDetails = {
  mathematics: {
    eyebrow: "Mathematics",
    title: "Maths with fewer dead ends and more click paths",
    summary:
      "Use this page to open GCSE, A-Level, and confidence-building maths support without losing the broader learning map.",
    image: "/visuals/subject-math.svg",
    accent: "#6366f1",
    highlights: [
      { title: "Exam confidence", description: "Break tricky questions into smaller wins and keep the pace calm." },
      { title: "Board support", description: "AQA, Edexcel, OCR, and Cambridge routes stay visible and easy to follow." },
      { title: "Progress focus", description: "Every lesson can feed into the archive and the library handoff." },
      { title: "Tutor fit", description: "Match around clarity, pace, and how the student wants to work." },
    ],
  },
  science: {
    eyebrow: "Science",
    title: "Science routes that make the subject feel more visual",
    summary:
      "Physics, chemistry, and biology each deserve their own path, so this page lets students choose the lane that fits.",
    image: "/visuals/subject-physics.svg",
    accent: "#06b6d4",
    highlights: [
      { title: "Physics", description: "Concepts, calculations, and exam practice with stronger visual framing." },
      { title: "Chemistry", description: "Reactions, structures, and practical questions laid out clearly." },
      { title: "Biology", description: "Systems, processes, and memorisation support in a calm flow." },
      { title: "Lab thinking", description: "Use the live board and archive to keep track of the steps." },
    ],
  },
  languages: {
    eyebrow: "Languages",
    title: "French and Spanish support with clearer speaking practice",
    summary:
      "Language pages should feel interactive, not static, so students can see the speaking, writing, and revision paths.",
    image: "/visuals/subject-spanish.svg",
    accent: "#f97316",
    highlights: [
      { title: "Speaking", description: "Build confidence with live practice in the classroom room." },
      { title: "Writing", description: "Essay structure, grammar, and exam phrasing stay tidy." },
      { title: "Listening", description: "Use the lesson archive to revisit examples and drills." },
      { title: "Exam boards", description: "Keep the regional exam structure visible from the start." },
    ],
  },
  english: {
    eyebrow: "English",
    title: "English pages that make reading and writing feel less heavy",
    summary:
      "This route is built for comprehension, essays, and expressive writing with fewer dead ends.",
    image: "/visuals/subject-english.svg",
    accent: "#8b5cf6",
    highlights: [
      { title: "Reading", description: "Close reading, inference, and understanding made easier to scan." },
      { title: "Writing", description: "Paragraph rhythm, structure, and vocabulary get their own focus." },
      { title: "Exam prep", description: "The page keeps GCSE and A-Level paths prominent." },
      { title: "Support loop", description: "The student portal can pick up the follow-up after each session." },
    ],
  },
} as const;

export const journeyDetails = {
  assessment: {
    eyebrow: "Assessment",
    title: "The first step is a quick diagnostic that feels human",
    summary:
      "The goal is to understand confidence, pace, and subject fit before the first live lesson starts.",
    image: "/visuals/subject-cs.svg",
    accent: "#0f766e",
    highlights: [
      { title: "Quick signal", description: "Start with a small set of prompts instead of a heavy form." },
      { title: "Clear starting point", description: "Know what needs attention before the tutor joins." },
      { title: "Regional fit", description: "Keep the placement flexible across the supported markets." },
      { title: "Next step", description: "Route directly into matching and live session setup." },
    ],
  },
  matching: {
    eyebrow: "Matching",
    title: "Matching should feel like a decision, not a guess",
    summary:
      "This route shows how tutor fit, subject support, and learning style align before the lesson begins.",
    image: "/visuals/tutor-james.svg",
    accent: "#7c3aed",
    highlights: [
      { title: "Tutor fit", description: "Match around pace, style, and subject strength." },
      { title: "Trust", description: "Make the screening and support standard visible." },
      { title: "Confidence", description: "Show families why the match feels right." },
      { title: "Action", description: "Move from the match page straight into the live room." },
    ],
  },
  "live-classroom": {
    eyebrow: "Live classroom",
    title: "The live room is where the product really happens",
    summary:
      "Video, board sync, participant state, and speaker focus all live here together.",
    image: "/visuals/hero-classroom.svg",
    accent: "#d97706",
    highlights: [
      { title: "Audio/video", description: "Join with camera and microphone in a real meeting-style room." },
      { title: "Board sync", description: "Keep the whiteboard in step with the live conversation." },
      { title: "Speaker focus", description: "The active speaker tile gets more visual weight." },
      { title: "Archive handoff", description: "End the session and save the record cleanly." },
    ],
  },
  archive: {
    eyebrow: "Archive",
    title: "Archive and follow-up turn the lesson into something reusable",
    summary:
      "Saved boards, lesson notes, and the library handoff make the live session feel complete.",
    image: "/visuals/success-story.svg",
    accent: "#be185d",
    highlights: [
      { title: "Saved board", description: "The board snapshot stays attached to the lesson record." },
      { title: "Library", description: "The archive shows up in the record hub without extra clicks." },
      { title: "Follow-up", description: "The client portal can carry the next action forward." },
      { title: "Completion", description: "The end of the session feels intentional rather than abrupt." },
    ],
  },
} as const;

export const journeyRoutes = [
  {
    href: "/how-it-works/assessment",
    title: "Assessment",
    summary: "Diagnostics, confidence mapping, and the first learning signal.",
    image: "/visuals/subject-cs.svg",
  },
  {
    href: "/how-it-works/matching",
    title: "Matching",
    summary: "Tutor fit, region support, and style alignment before the first lesson.",
    image: "/visuals/tutor-james.svg",
  },
  {
    href: "/how-it-works/live-classroom",
    title: "Live classroom",
    summary: "Video, whiteboard, speaker focus, and collaborative teaching in one room.",
    image: "/visuals/hero-classroom.svg",
  },
  {
    href: "/how-it-works/archive",
    title: "Archive and follow-up",
    summary: "Saved boards, lesson history, and the next-step handoff into the library.",
    image: "/visuals/success-story.svg",
  },
];

export const processSteps = [
  {
    num: "01",
    title: "Assessment",
    desc: "Take a short diagnostic so we can understand the starting point before anything else.",
  },
  {
    num: "02",
    title: "Matching",
    desc: "We align the student with a tutor who fits the subject, pace, and teaching style.",
  },
  {
    num: "03",
    title: "Learning",
    desc: "Lessons run live with the board, archive, and feedback loop all connected.",
  },
  {
    num: "04",
    title: "Success",
    desc: "Progress becomes visible in the classroom, the library, and the student portal.",
  },
];

export const teachingPillars = [
  {
    title: "Live classroom",
    description:
      "Audio, video, board sync, and archive handoff stay connected from session start to finish.",
  },
  {
    title: "Exam focus",
    description:
      "The product supports the different exam and learning styles you asked for across regions.",
  },
  {
    title: "Regional readiness",
    description:
      "The interface speaks clearly across UK, Nigeria, Germany, Spain, Mauritius, France, the US, and Canada.",
  },
  {
    title: "Premium flow",
    description:
      "Each route has its own purpose, so the site feels like a real product with a clear path.",
  },
];

export const examBoards = ["AQA", "Edexcel", "OCR", "WJEC", "CCEA", "Cambridge"];
