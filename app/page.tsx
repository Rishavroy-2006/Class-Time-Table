'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

const dailyTips = [
  "📘 Tip: Review class notes every evening for 15 mins!",
  "🧠 Fun Fact: Studying before sleep helps retention.",
  "💡 Tip: Take short breaks between long study sessions.",
  "🚀 Motivation: You're closer than you think!",
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

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>('Loading...');
  const [currentStatus, setCurrentStatus] = useState<string>('Loading...');
  const [nextClass, setNextClass] = useState<string>('Loading...');
  const [dailyTip, setDailyTip] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedTime, setSelectedTime] = useState<string>('10:00');

  function getCurrentClass(customDay: string | null = null, customTime: string | null = null) {
    const now = new Date();
    const currentDay = customDay || ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()];
    const currentTimeHours = customTime ? parseFloat(customTime.split(":")[0]) + parseFloat(customTime.split(":")[1]) / 60
      : now.getHours() + now.getMinutes() / 60;

    const displayTime = customTime ? `${customTime} (${currentDay})` : now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ` (${currentDay})`;
    setCurrentTime(displayTime);

    if (currentDay === "Saturday" || currentDay === "Sunday") {
      setCurrentStatus("Holiday (Weekend)");
      setNextClass("-");
      return;
    }

    const todayClasses = timetable[currentDay as keyof typeof timetable];
    let currentSlot = -1;

    for (let i = 0; i < timeSlots.length; i++) {
      const [hour, minute] = timeSlots[i].split(":").map(Number);
      const slotTime = hour + minute / 60;
      const nextSlotTime = i < timeSlots.length - 1 ? (parseFloat(timeSlots[i + 1].split(":")[0]) + parseFloat(timeSlots[i + 1].split(":")[1]) / 60) : 24;

      if (currentTimeHours >= slotTime && currentTimeHours < nextSlotTime) {
        currentSlot = i;
        break;
      }
    }

    if (currentSlot === -1) {
      setCurrentStatus("Outside of school hours");
      setNextClass("-");
      return;
    }

    const currentClassInfo = todayClasses[currentSlot];
    const currentSlotTime = timeSlots[currentSlot];
    if (currentClassInfo && currentClassInfo.trim() !== "") {
      setCurrentStatus(`${currentClassInfo} (${currentSlotTime})`);
    } else {
      setCurrentStatus(`Break or No Class (${currentSlotTime})`);
    }

    let nextClassInfo = "No upcoming class today";
    for (let i = currentSlot + 1; i < todayClasses.length; i++) {
      if (todayClasses[i] && todayClasses[i].trim() !== "" && todayClasses[i].trim().toUpperCase() !== "BREAK") {
        nextClassInfo = `${todayClasses[i]} (${timeSlots[i]})`;
        break;
      }
    }

    setNextClass(nextClassInfo);
  }

  useEffect(() => {
    getCurrentClass();
    const interval = setInterval(() => getCurrentClass(), 60 * 1000);
    
    const tipIndex = new Date().getDay() % dailyTips.length;
    setDailyTip(dailyTips[tipIndex]);

    return () => clearInterval(interval);
  }, []);

  const handleTest = () => {
    getCurrentClass(selectedDay, selectedTime);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '93vh', margin: '15px', padding: '30px' }}>
      <h1 style={{ color: '#90caf9', marginBottom: '5px', textAlign: 'center' }}>📅 College Timetable App</h1>
      <div style={{ fontSize: '1.1em', color: '#bb86fc', marginBottom: '20px', fontWeight: 'bold' }}>AIML 2A</div>

      <div style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
        maxWidth: '450px',
        width: '100%',
        transition: '0.3s ease',
      }}>
        <div style={{ fontSize: '1.1em', color: '#bb86fc', marginBottom: '8px' }}>Current Time:</div>
        <div style={{ fontSize: '1.2em', color: '#ffffff', fontWeight: 'bold', marginBottom: '20px' }}>{currentTime}</div>

        <div style={{ fontSize: '1.1em', color: '#bb86fc', marginBottom: '8px' }}>Current Status:</div>
        <div style={{ fontSize: '1.2em', color: '#ffffff', fontWeight: 'bold', marginBottom: '20px' }}>{currentStatus}</div>

        <div style={{ fontSize: '1.1em', color: '#bb86fc', marginBottom: '8px' }}>Next Class:</div>
        <div style={{ fontSize: '1.2em', color: '#ffffff', fontWeight: 'bold', marginBottom: '20px' }}>{nextClass}</div>
      </div>

      <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#aaa' }}>{dailyTip}</div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#e0e0e0' }}>🕒 Test Time Manually:</h3>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#2a2a2a',
            color: '#e0e0e0',
            margin: '5px',
            cursor: 'pointer',
          }}
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
        </select>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#2a2a2a',
            color: '#e0e0e0',
            margin: '5px',
          }}
        />
        <button
          onClick={handleTest}
          style={{
            backgroundColor: '#bb86fc',
            color: '#121212',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: '0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9a68dc')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bb86fc')}
        >
          Test
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link href="/timetable">
          <button
            style={{
              backgroundColor: '#bb86fc',
              color: '#121212',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: '0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9a68dc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#bb86fc')}
          >
            Open Full Timetable
          </button>
        </Link>
      </div>

      <footer style={{
        marginTop: 'auto',
        fontSize: '0.9em',
        color: '#888',
        textAlign: 'center',
        padding: '20px 0',
      }}>
        ⏰ Auto updates every minute • You can also test manually above
      </footer>
    </div>
  );
}
