const timetable = {
  Monday: [
    "Lab: COA Lab (AM391)/NF/316Q(X) & DAA Lab (AM392)/NDN/316O(Y)",
    "Lab: COA Lab (AM391)/NF/316Q(X) & DAA Lab (AM392)/NDN/316O(Y)",
    "Lab: COA Lab (AM391)/NF/316Q(X) & DAA Lab (AM392)/NDN/316O(Y)",
    "Analog & Digital Electronics (EC(AM)301)/ABS/504",
    "BREAK",
    "BREAK",
    "Lab: COA Lab (AM391)/NF/316Q(Y) & DAA Lab (AM392)/NDN/316O(X)",
    "Lab: COA Lab (AM391)/NF/316Q(Y) & DAA Lab (AM392)/NDN/316O(X)",
    "Lab: COA Lab (AM391)/NF/316Q(Y) & DAA Lab (AM392)/NDN/316O(X)",
    "",
    "",
    "",
  ],
  Tuesday: [
    "",
    "",
    "Design & Analysis of Algo (AM302)/AIML2A/DSR/504",
    "Lab: A&D Electronics Lab (EC(AM)391)/ABS/0(X) & IT Workshop (AM393)/KSB/316(Y)",
    "Lab: A&D Electronics Lab (EC(AM)391)/ABS/0(X) & IT Workshop (AM393)/KSB/316(Y)",
    "Lab: A&D Electronics Lab (EC(AM)391)/ABS/0(X) & IT Workshop (AM393)/KSB/316(Y)",
    "BREAK",
    "BREAK",
    "Data Structures (AM201)/AIML2A/NDN/307",
    "Lab: IT Workshop (AM393)/GPP/316(X) & A&D Electronics Lab (EC(AM)391)/ABS/0(Y)",
    "Lab: IT Workshop (AM393)/GPP/316(X) & A&D Electronics Lab (EC(AM)391)/ABS/0(Y)",
    "",
  ],
  Wednesday: [
    "Computer Org. & Arch. (AM301)/AIML2A/NDN/307",
    "Discrete Math (M(AM)301)/AIML2A/NLS/307",
    "Analog & Digital Electronics (EC(AM)301)/AIML2A/ABS/307",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  Thursday: [
    "Design & Analysis of Algo (AM302)/AIML2A/DSR/307",
    "Discrete Math (M(AM)301)/AIML2A/NLS/307",
    "Analog & Digital Electronics (EC(AM)301)/AIML2A/ABS/408",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  Friday: [
    "Computer Org. & Arch. (AM301)/AIML2A/NDN/307",
    "Discrete Math (M(AM)301)/AIML2A/SKL/307",
    "Design & Analysis of Algo (AM302)/AIML2A/DSR/504",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
};

const timeSlots = [
  "10:00", "10:40", "11:20", "12:00", "12:40",
  "13:20", "14:00", "14:40", "15:20", "16:00", "16:40"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const dailyTips = [
  "📘 Tip: Review class notes every evening for 15 mins!",
  "🧠 Fun Fact: Studying before sleep helps retention.",
  "💡 Tip: Take short breaks between long study sessions.",
  "🚀 Motivation: You’re closer than you think!",
  "📅 Planning: Update your goals every Sunday night.",
  "🎯 Focus: Eliminate distractions for 25 mins and take 5 mins break.",
  "🌱 Reminder: Progress > Perfection.",
  "📚 Tip: Summarize what you learn in your own words.",
  "🔋 Recharge: Sleep well – brain needs rest too.",
  "📈 Boost: Try teaching a concept to someone else.",
  "🔍 Trick: Use the Feynman Technique to deeply understand topics.",
  "🎧 Hack: Try instrumental music while studying.",
  "📝 Strategy: Set 3 micro-goals each morning.",
  "🙌 Truth: Small consistent effort beats rare big effort."
];

// Export if using modules, but since it's a simple script inclusion we just leave them globally available.
window.timetableData = {
  timetable,
  timeSlots,
  days,
  dailyTips
};
