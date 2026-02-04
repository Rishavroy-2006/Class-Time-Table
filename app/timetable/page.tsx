'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  "13:20", "14:00", "14:40", "15:20", "16:00",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getCellClassName(entry: string): string {
  if (!entry.trim()) return 'empty';
  if (entry.toUpperCase().includes('BREAK')) return 'break';
  if (entry.toUpperCase().includes('LAB')) return 'lab';
  return 'class';
}

function getCellContent(entry: string): string {
  if (!entry.trim()) return '—';
  return entry;
}

export default function Timetable() {
  const router = useRouter();
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(-1);
  const [currentDay, setCurrentDay] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const slotTimes = [
      [600, 640],
      [640, 680],
      [680, 720],
      [720, 760],
      [760, 800],
      [800, 840],
      [840, 880],
      [880, 920],
      [920, 960],
      [960, 1000],
      [1000, 1040],
    ];

    for (let i = 0; i < slotTimes.length; i++) {
      const [start, end] = slotTimes[i];
      if (currentMinutes >= start && currentMinutes < end) {
        setCurrentSlotIndex(i);
        break;
      }
    }

    const dayIndex = now.getDay();
    if (dayIndex > 0 && dayIndex < 6) {
      setCurrentDay(days[dayIndex - 1]);
    }

    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      for (let i = 0; i < slotTimes.length; i++) {
        const [start, end] = slotTimes[i];
        if (currentMinutes >= start && currentMinutes < end) {
          setCurrentSlotIndex(i);
          break;
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: '#121212', color: '#ddd', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', margin: '20px', paddingBottom: '40px' }}>
      <h2 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '20px' }}>Full Week Class Timetable</h2>
      
      <div style={{ overflowX: 'auto', marginBottom: '20px', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ backgroundColor: '#4a148c', color: 'white', border: '1px solid #444', padding: '10px 8px', fontSize: '13px', textAlign: 'center' }}>Time</th>
              {days.map((day) => (
                <th key={day} style={{ backgroundColor: '#4a148c', color: 'white', border: '1px solid #444', padding: '10px 8px', fontSize: '13px', textAlign: 'center' }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, slotIndex) => (
              <tr key={slot}>
                <td style={{ backgroundColor: '#8938d1', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', border: '1px solid #444', padding: '10px 8px', fontSize: '13px', textAlign: 'center', verticalAlign: 'middle' }}>
                  {slot} - {timeSlots[slotIndex + 1] || '18:00'}
                </td>
                {days.map((day) => {
                  const entry = timetable[day as keyof typeof timetable][slotIndex] || '';
                  const className = getCellClassName(entry);
                  const content = getCellContent(entry);
                  const isCurrentSlot = slotIndex === currentSlotIndex && day === currentDay;

                  let bgColor = '#1e1e1e';
                  let textColor = '#ddd';

                  if (className === 'lab') {
                    bgColor = '#b3e5fc';
                    textColor = '#01579b';
                  } else if (className === 'break') {
                    bgColor = '#cfd8dc';
                    textColor = '#333';
                  } else if (className === 'class') {
                    bgColor = '#c8e6c9';
                    textColor = '#1b5e20';
                  } else if (className === 'empty') {
                    bgColor = '#212121';
                    textColor = '#555';
                  }

                  return (
                    <td
                      key={`${day}-${slot}`}
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        border: '1px solid #444',
                        padding: '10px 8px',
                        fontSize: '13px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        wordWrap: 'break-word',
                        fontWeight: className === 'lab' ? 'bold' : className === 'class' ? '500' : 'normal',
                        fontStyle: className === 'break' ? 'italic' : 'normal',
                        position: 'relative',
                      }}
                    >
                      {content}
                      {isCurrentSlot && (
                        <span
                          style={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: '#00ff99',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            boxShadow: '0 0 6px #929292',
                          }}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => router.back()}
        style={{
          display: 'block',
          margin: '0 auto',
          backgroundColor: '#4a148c',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6a25c8')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a148c')}
      >
        ← Back
      </button>
    </div>
  );
}
