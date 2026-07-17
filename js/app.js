// Handle group filtering state
let currentGroupFilter = localStorage.getItem('groupFilter') || 'Both';

// Modal logic for class details
function showClassDetails(rawText) {
  let modal = document.getElementById('classDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'classDetailsModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] p-4 opacity-0 pointer-events-none transition-opacity duration-200';
    modal.innerHTML = `
      <div class="bg-surface rounded-xl max-w-md w-full p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transform scale-95 transition-transform duration-200">
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-headline-md text-headline-md text-on-surface">Class Details</h3>
          <span class="material-symbols-outlined cursor-pointer text-on-surface-variant hover:text-on-surface" onclick="closeClassDetails()">close</span>
        </div>
        <div class="font-body-lg text-body-lg text-on-surface-variant break-words mt-2" id="classDetailsText"></div>
        <div class="mt-6 flex justify-end">
          <button class="px-4 py-2 bg-primary text-on-primary rounded-lg font-title-sm hover:bg-primary-container transition-colors" onclick="closeClassDetails()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    window.closeClassDetails = function() {
      const m = document.getElementById('classDetailsModal');
      m.classList.remove('opacity-100', 'pointer-events-auto');
      m.classList.add('opacity-0', 'pointer-events-none');
      m.querySelector('.bg-surface').classList.remove('scale-100');
      m.querySelector('.bg-surface').classList.add('scale-95');
    };
  }
  
  document.getElementById('classDetailsText').innerText = rawText;
  
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100', 'pointer-events-auto');
  modal.querySelector('.bg-surface').classList.remove('scale-95');
  modal.querySelector('.bg-surface').classList.add('scale-100');
}

function setGroupFilter(filter) {
  currentGroupFilter = filter;
  localStorage.setItem('groupFilter', filter);
  if (document.getElementById("groupFilterSelect")) {
    document.getElementById("groupFilterSelect").value = filter;
  }
  // Re-render
  if (document.getElementById("greeting")) updateTodayUI();
  if (document.getElementById("scheduleScrollContainer")) renderFullTimetable();
}

// Utility to format class names and get corresponding Tailwind classes
function formatClassName(classInfo) {
  if (!classInfo || classInfo.trim() === "") return { type: "empty", text: "—", raw: classInfo, bg: "bg-surface-container-high", border: "border-outline-variant", textClass: "text-on-surface-variant" };
  
  const upper = classInfo.toUpperCase();
  
  if (upper.includes("BREAK")) {
    return { type: "break", text: "Break", raw: classInfo, bg: "bg-surface-container-high border border-outline-variant", border: "border-outline-variant", textClass: "text-on-surface-variant" };
  }
  
  let isLab = upper.includes("LAB:");
  let parsedText = classInfo;
  
  // Custom parsing to shorten text: "Subject (Room)"
  if (classInfo.includes(" & ") && classInfo.includes("(X)")) {
    const parts = classInfo.split(" & ");
    let textX = "";
    let textY = "";
    
    parts.forEach(part => {
      const isX = part.includes("(X)");
      const isY = part.includes("(Y)");
      
      let clean = part.replace(/Lab:\s*/i, "").trim();
      const slashParts = clean.split("/");
      let subject = slashParts[0].split('(')[0].trim();
      let roomRaw = slashParts[slashParts.length - 1] || "";
      let room = roomRaw.replace(/\(X\)|\(Y\)/g, "").trim();
      let formatted = room ? `${subject} (${room})` : subject;
      
      if (isX) textX = formatted;
      if (isY) textY = formatted;
      if (!isX && !isY) textX = formatted;
    });

    if (currentGroupFilter === 'X') {
      parsedText = textX ? textX + " (X)" : "Free Time"; // If no X class, they are free
    } else if (currentGroupFilter === 'Y') {
      parsedText = textY ? textY + " (Y)" : "Free Time";
    } else {
      parsedText = `${textX} (X)<br/>${textY} (Y)`;
    }
    isLab = true;
    
    // If the filter results in no class for this group (e.g. Free Time), treat as empty/break
    if (parsedText === "Free Time") {
      return { type: "empty", text: "—", raw: classInfo, bg: "bg-surface-container-high", border: "border-outline-variant", textClass: "text-on-surface-variant" };
    }
  } else {
    // Regular class
    let clean = classInfo.replace(/Lab:\s*/i, "").trim();
    const slashParts = clean.split("/");
    let subject = slashParts[0].split('(')[0].trim();
    let roomRaw = slashParts[slashParts.length - 1] || "";
    let room = roomRaw.replace(/\(X\)|\(Y\)/g, "").trim();
    parsedText = room ? `${subject} (${room})` : subject;
  }
  
  if (isLab) {
    return { type: "lab", text: parsedText, raw: classInfo, bg: "bg-secondary-container", border: "border-on-secondary-container", textClass: "text-on-secondary-container" };
  } else {
    return { type: "lecture", text: parsedText, raw: classInfo, bg: "bg-primary-container", border: "border-primary", textClass: "text-on-primary-container" };
  }
}

// Convert "HH:MM" string to fractional hours (e.g., "10:30" -> 10.5)
function timeToFloat(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h + m / 60;
}

// Format date nicely
function formatDate(date) {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Get the current class based on time
function getCurrentClassInfo(customDay = null, customTime = null) {
  const { timetable, timeSlots, days } = window.timetableData;
  let now = new Date();
  
  let dayIndex = now.getDay();
  let currentDay = customDay || (dayIndex === 0 ? "Sunday" : dayIndex === 6 ? "Saturday" : days[dayIndex - 1]);
  
  let currentTimeFloat = customTime 
    ? timeToFloat(customTime)
    : now.getHours() + now.getMinutes() / 60;

  if (currentDay === "Saturday" || currentDay === "Sunday") {
    return { status: { text: "Weekend", type: "break", time: "" }, nextStatus: { text: "-", type: "empty", time: "" }, slotIndex: -1, currentDay };
  }

  const todayClasses = timetable[currentDay];
  let currentSlot = -1;

  for (let i = 0; i < timeSlots.length; i++) {
    const slotTime = timeToFloat(timeSlots[i]);
    let nextSlotTime = i < timeSlots.length - 1 ? timeToFloat(timeSlots[i + 1]) : 18.0;

    if (currentTimeFloat >= slotTime && currentTimeFloat < nextSlotTime) {
      currentSlot = i;
      break;
    }
  }

  let status = { text: "Offline", type: "break", time: "" };
  if (currentSlot !== -1) {
    const currentClassRaw = todayClasses[currentSlot];
    const formattedCurrent = formatClassName(currentClassRaw);
    status = { 
      text: formattedCurrent.text === "—" ? "Free Time" : formattedCurrent.text, 
      type: formattedCurrent.type, 
      time: timeSlots[currentSlot],
      bg: formattedCurrent.bg,
      textClass: formattedCurrent.textClass,
      border: formattedCurrent.border
    };
  }

  // Search for next upcoming class
  let nextStatus = { text: "No more classes today", type: "empty", time: "", bg: "", textClass: "text-on-surface-variant" };
  const startSearch = currentSlot === -1 ? 0 : currentSlot + 1;
  for (let i = startSearch; i < todayClasses.length; i++) {
    const checkClass = formatClassName(todayClasses[i]);
    if (checkClass.type === "lecture" || checkClass.type === "lab") {
      const classStart = timeToFloat(timeSlots[i]);
      if (classStart > currentTimeFloat) {
        nextStatus = { text: checkClass.text, type: checkClass.type, time: timeSlots[i], bg: checkClass.bg, textClass: checkClass.textClass, border: checkClass.border };
        break;
      }
    }
  }

  return { status, nextStatus, slotIndex: currentSlot, currentDay };
}

// Update the "Today" view UI (index.html)
function updateTodayUI(customDay = null, customTime = null) {
  const elGreeting = document.getElementById("greeting");
  const elDateText = document.getElementById("currentDateText");
  const elStatusBadge = document.getElementById("currentStatusBadge");
  const elStatusTitle = document.getElementById("currentStatusTitle");
  const elStatusTime = document.getElementById("currentStatusTime");
  const elNextHero = document.getElementById("nextClassHero");
  const todayTimeline = document.getElementById("todayTimeline");

  if (!elGreeting) return; // Not on the index page

  const now = new Date();
  const hours = now.getHours();
  let greeting = "Good evening,";
  if (hours < 12) greeting = "Good morning,";
  else if (hours < 17) greeting = "Good afternoon,";
  elGreeting.innerText = greeting;
  elDateText.innerText = formatDate(now);

  const info = getCurrentClassInfo(customDay, customTime);

  // Update Hero Card with Current/Next Class
  if (info.status.type === "lecture" || info.status.type === "lab") {
    elStatusBadge.innerText = "Class In Progress";
    elStatusTitle.innerHTML = info.status.text; // using innerHTML for <br/>
    elStatusTime.innerText = info.status.time + " - " + (info.slotIndex < window.timetableData.timeSlots.length -1 ? window.timetableData.timeSlots[info.slotIndex + 1] : "End");
    elNextHero.className = `border rounded-xl p-container-padding shadow-md relative overflow-hidden ${info.status.bg} ${info.status.border}`;
    elStatusTitle.className = `font-headline-md text-headline-md mb-2 relative z-10 ${info.status.textClass}`;
  } else {
    elStatusBadge.innerText = "Up Next";
    elStatusTitle.innerHTML = info.nextStatus.text;
    elStatusTime.innerText = info.nextStatus.time ? info.nextStatus.time : "--:--";
    elNextHero.className = `bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm relative overflow-hidden`;
    elStatusTitle.className = `font-headline-md text-headline-md text-on-surface mb-2 relative z-10`;
  }

  // Render Today's Timeline Graph
  if (todayTimeline) {
    todayTimeline.innerHTML = `
      <div class="absolute left-0 top-4 font-mono-label text-mono-label text-on-surface-variant">08:00</div>
      <div class="absolute left-0 top-[64px] font-mono-label text-mono-label text-on-surface-variant">09:00</div>
      <div class="absolute left-0 top-[124px] font-mono-label text-mono-label text-on-surface-variant">10:00</div>
      <div class="absolute left-0 top-[184px] font-mono-label text-mono-label text-on-surface-variant">11:00</div>
      <div class="absolute left-0 top-[244px] font-mono-label text-mono-label text-on-surface-variant">12:00</div>
      <div class="absolute left-0 top-[304px] font-mono-label text-mono-label text-on-surface-variant">13:00</div>
      <div class="absolute left-0 top-[364px] font-mono-label text-mono-label text-on-surface-variant">14:00</div>
      <div class="absolute left-0 top-[424px] font-mono-label text-mono-label text-on-surface-variant">15:00</div>
      <div class="absolute left-0 top-[484px] font-mono-label text-mono-label text-on-surface-variant">16:00</div>
      <div class="absolute left-0 top-[544px] font-mono-label text-mono-label text-on-surface-variant">17:00</div>
      <div class="absolute left-0 top-[604px] font-mono-label text-mono-label text-on-surface-variant">18:00</div>
    `;
    
    if (info.currentDay !== "Saturday" && info.currentDay !== "Sunday") {
      const todayClasses = window.timetableData.timetable[info.currentDay];
      const timeSlots = window.timetableData.timeSlots;
      
      let i = 0;
      while (i < timeSlots.length) {
        const cls = formatClassName(todayClasses[i]);
        if (cls.type === "empty") {
          i++;
          continue;
        }

        const startHr = timeToFloat(timeSlots[i]);
        let endIndex = i;
        // Group consecutive identical classes
        while (endIndex + 1 < timeSlots.length && formatClassName(todayClasses[endIndex + 1]).raw === cls.raw) {
          endIndex++;
        }
        
        const endHr = endIndex < timeSlots.length - 1 ? timeToFloat(timeSlots[endIndex + 1]) : timeToFloat(timeSlots[endIndex]) + 40/60; 
        
        // 8:00 is top 16px (4 * 4px for padding-top pt-4). 60px per hour.
        const topPx = 16 + (startHr - 8) * 60;
        const heightPx = (endHr - startHr) * 60;

        const block = document.createElement("div");
        block.className = `absolute left-16 right-4 rounded-lg px-2 py-1 overflow-hidden shadow-sm flex flex-col justify-center ${cls.bg} ${cls.type === 'break' ? '' : 'border-l-4 ' + cls.border} cursor-pointer`;
        block.style.top = `${topPx}px`;
        block.style.height = `${heightPx}px`;
        block.onclick = () => showClassDetails(cls.raw);
        
        block.innerHTML = `
          <div class="font-title-sm text-[13px] leading-tight truncate ${cls.textClass}">${cls.text}</div>
          <div class="font-mono-label text-[11px] opacity-80 mt-0.5 ${cls.textClass}">${timeSlots[i]} - ${endIndex < timeSlots.length - 1 ? timeSlots[endIndex + 1] : 'End'}</div>
        `;
        todayTimeline.appendChild(block);

        i = endIndex + 1;
      }

      // Add Current Time line indicator
      let currentTimeFloat = customTime ? timeToFloat(customTime) : now.getHours() + now.getMinutes() / 60;
      if (currentTimeFloat >= 8 && currentTimeFloat <= 18) {
        const currentTop = 16 + (currentTimeFloat - 8) * 60;
        const line = document.createElement("div");
        line.className = "absolute left-14 right-0 h-[2px] bg-error z-20 pointer-events-none";
        line.style.top = `${currentTop}px`;
        line.innerHTML = `<div class="w-2 h-2 rounded-full bg-error absolute -left-1 -top-[3px]"></div>`;
        todayTimeline.appendChild(line);
      }
    }
  }
}

// Render the full timetable grid (timetable.html)
function renderFullTimetable() {
  const container = document.getElementById("scheduleScrollContainer");
  if (!container) return; // Not on the timetable page

  const { timetable, timeSlots, days } = window.timetableData;
  
  const timeAxis = document.getElementById("timeAxis");
  const horizontalGridLines = document.getElementById("horizontalGridLines");
  
  timeAxis.innerHTML = "";
  horizontalGridLines.innerHTML = "";
  
  // Hours from 8 to 18 (10 hours + 1 for end)
  // Grid lines
  for(let hour = 8; hour <= 18; hour++) {
    if (hour < 18) {
      const gridRow = document.createElement("div");
      gridRow.className = "h-24 border-b border-outline-variant box-border relative";
      gridRow.innerHTML = `
        <div class="absolute top-1/4 w-full border-b border-outline-variant opacity-30"></div>
        <div class="absolute top-2/4 w-full border-b border-outline-variant opacity-30"></div>
        <div class="absolute top-3/4 w-full border-b border-outline-variant opacity-30"></div>
      `;
      horizontalGridLines.appendChild(gridRow);
    }
    
    // Time labels accurately matching pixel positions
    const topPx = (hour - 8) * 96;
    const timeLabel = document.createElement("div");
    timeLabel.className = "absolute right-2 font-mono-label text-mono-label text-on-surface-variant whitespace-nowrap";
    timeLabel.style.top = `${topPx - 8}px`; // shift up by 8px for vertical centering
    timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
    timeAxis.appendChild(timeLabel);
  }

  // Render classes for each day
  days.forEach(day => {
    const colId = `col-${day.toLowerCase()}`;
    const col = document.getElementById(colId);
    if (!col) return;
    
    col.innerHTML = ""; // Clear existing
    const dayClasses = timetable[day];
    
    let i = 0;
    while(i < timeSlots.length) {
      const cls = formatClassName(dayClasses[i]);
      if (cls.type === "empty") {
        i++;
        continue;
      }
      
      const startHr = timeToFloat(timeSlots[i]);
      let endIndex = i;
      while (endIndex + 1 < timeSlots.length && formatClassName(dayClasses[endIndex + 1]).raw === cls.raw) {
        endIndex++;
      }

      const endHr = endIndex < timeSlots.length - 1 ? timeToFloat(timeSlots[endIndex+1]) : timeToFloat(timeSlots[endIndex]) + 40/60;
      
      // 96px per hour
      const topPx = (startHr - 8) * 96;
      const heightPx = (endHr - startHr) * 96;
      
      const block = document.createElement("div");
      block.className = `absolute left-1 right-1 rounded px-1.5 py-1 overflow-hidden hover:shadow-md transition-shadow cursor-pointer z-10 flex flex-col ${cls.bg} ${cls.type === 'break' ? 'border border-outline-variant' : 'border-l-4 ' + cls.border}`;
      block.style.top = `${topPx + 2}px`; // +2px padding
      block.style.height = `${heightPx - 4}px`; // -4px gap between contiguous elements
      block.onclick = () => showClassDetails(cls.raw);
      
      block.innerHTML = `
        <div class="font-title-sm text-[13px] leading-tight mb-0.5 flex-1 overflow-hidden line-clamp-2 ${cls.textClass}">${cls.text}</div>
        <div class="font-mono-label text-[10px] flex flex-col gap-[2px] ${cls.textClass} opacity-90 mt-auto shrink-0">
          <span>${timeSlots[i]} - ${endIndex < timeSlots.length - 1 ? timeSlots[endIndex+1] : 'End'}</span>
        </div>
      `;
      col.appendChild(block);

      i = endIndex + 1;
    }
  });

  // Current time line
  const now = new Date();
  const dayIndex = now.getDay();
  if (dayIndex > 0 && dayIndex < 6) {
    const currentDayStr = days[dayIndex - 1];
    const colId = `col-${currentDayStr.toLowerCase()}`;
    const col = document.getElementById(colId);
    
    if (col) {
      const currentHr = now.getHours() + now.getMinutes() / 60;
      if (currentHr >= 8 && currentHr <= 18) {
        const topPx = (currentHr - 8) * 96;
        const line = document.createElement("div");
        line.className = "absolute left-0 right-0 h-[2px] bg-error z-20 pointer-events-none";
        line.style.top = `${topPx}px`;
        line.innerHTML = `<div class="w-2 h-2 rounded-full bg-error absolute -left-1 -top-[3px]"></div>`;
        col.appendChild(line);
        col.classList.add("bg-primary-fixed-dim/5"); // Highlight current day column
        document.getElementById(`header-${currentDayStr.toLowerCase()}`).classList.add("text-primary");
      }
    }
  }
}

// SPA Routing logic to eliminate flickering
let todayInterval;
let timetableInterval;

function loadProfileData() {
  const name = localStorage.getItem('studentName') || 'Student Name';
  const major = localStorage.getItem('studentMajor') || 'Department';
  const pic = localStorage.getItem('studentPic');

  document.querySelectorAll('.sidebar-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.sidebar-major').forEach(el => el.textContent = major);
  
  if (pic) {
    document.querySelectorAll('.sidebar-pic').forEach(el => {
      el.src = pic;
      el.classList.remove('hidden');
    });
    document.querySelectorAll('.sidebar-icon').forEach(el => el.classList.add('hidden'));
  }
}

function initSettings() {
  const saveBtn = document.getElementById('settingsSaveBtn');
  if (!saveBtn) return;

  document.getElementById('settingsName').value = localStorage.getItem('studentName') || '';
  document.getElementById('settingsEmail').value = localStorage.getItem('studentEmail') || '';
  document.getElementById('settingsId').value = localStorage.getItem('studentId') || '';
  document.getElementById('settingsMajor').value = localStorage.getItem('studentMajor') || '';

  const picData = localStorage.getItem('studentPic');
  if (picData) {
    const picEl = document.getElementById('settingsPic');
    const phEl = document.getElementById('settingsPicPlaceholder');
    picEl.src = picData;
    picEl.classList.remove('hidden');
    phEl.classList.add('hidden');
  }

  const picBtn = document.getElementById('settingsEditPicBtn');
  const picInput = document.getElementById('settingsPicInput');
  
  if (picBtn && picInput) {
    picBtn.addEventListener('click', (e) => {
      if (e.target !== picInput) {
        picInput.click();
      }
    });

    picInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          const picEl = document.getElementById('settingsPic');
          picEl.src = base64;
          picEl.classList.remove('hidden');
          document.getElementById('settingsPicPlaceholder').classList.add('hidden');
          localStorage.setItem('studentPic', base64);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  saveBtn.addEventListener('click', () => {
    localStorage.setItem('studentName', document.getElementById('settingsName').value);
    localStorage.setItem('studentEmail', document.getElementById('settingsEmail').value);
    localStorage.setItem('studentId', document.getElementById('settingsId').value);
    localStorage.setItem('studentMajor', document.getElementById('settingsMajor').value);
    
    const picEl = document.getElementById('settingsPic');
    if (picEl.src && picEl.src.startsWith('data:image')) {
        localStorage.setItem('studentPic', picEl.src);
    }

    loadProfileData();
    
    saveBtn.textContent = "Saved!";
    saveBtn.classList.add('bg-[#10B981]');
    setTimeout(() => {
      saveBtn.textContent = "Save Changes";
      saveBtn.classList.remove('bg-[#10B981]');
    }, 2000);
  });
}

function initApp() {
  if (todayInterval) clearInterval(todayInterval);
  if (timetableInterval) clearInterval(timetableInterval);

  loadProfileData();
  initSettings();

  const groupFilterSelect = document.getElementById("groupFilterSelect");
  if (groupFilterSelect) {
    groupFilterSelect.value = currentGroupFilter;
    groupFilterSelect.addEventListener("change", (e) => {
      setGroupFilter(e.target.value);
    });
  }

  if (document.getElementById("greeting")) {
    updateTodayUI();
    todayInterval = setInterval(updateTodayUI, 60 * 1000);
  }

  if (document.getElementById("scheduleScrollContainer")) {
    renderFullTimetable();
    timetableInterval = setInterval(renderFullTimetable, 60 * 1000);
  }
}

async function navigateTo(href) {
  try {
    const res = await fetch(href);
    const text = await res.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    
    const currentMain = document.querySelector("main");
    const newMain = doc.querySelector("main");
    if (currentMain && newMain) {
      currentMain.innerHTML = newMain.innerHTML;
    }
    
    const currentDesktopNav = document.querySelector("nav.hidden.md\\:flex");
    const newDesktopNav = doc.querySelector("nav.hidden.md\\:flex");
    if (currentDesktopNav && newDesktopNav) {
      currentDesktopNav.innerHTML = newDesktopNav.innerHTML;
    }
    
    const currentMobileNav = document.querySelector("nav.md\\:hidden.fixed.bottom-0");
    const newMobileNav = doc.querySelector("nav.md\\:hidden.fixed.bottom-0");
    if (currentMobileNav && newMobileNav) {
      currentMobileNav.innerHTML = newMobileNav.innerHTML;
    }
    
    document.title = doc.title;
    
    initApp();
  } catch (err) {
    console.error("Navigation failed", err);
    window.location.href = href;
  }
}

const routes = {
  "": "index.html",
  "index": "index.html",
  "timetable": "timetable.html",
  "courses": "courses.html",
  "tasks": "tasks.html",
  "exams": "exams.html",
  "settings": "settings.html"
};

function handleRoute() {
  let hash = window.location.hash.replace("#", "");
  const fileToFetch = routes[hash] || "index.html";
  
  const currentPath = window.location.pathname.split('/').pop() || "index.html";
  if (currentPath !== fileToFetch) {
    navigateTo(fileToFetch);
  } else {
    initApp();
  }
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  if (!window.timetableData) {
    console.error("Timetable data not found!");
    return;
  }
  
  handleRoute();

  document.body.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (!a) return;
    
    const href = a.getAttribute("href");
    if (href && href.endsWith(".html") && !href.startsWith("http")) {
      e.preventDefault();
      const route = href === "index.html" ? "" : href.replace(".html", "");
      window.location.hash = route;
    }
  });

  window.addEventListener("hashchange", handleRoute);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("Service Worker registered successfully."))
        .catch((err) => console.log("SW registration failed", err));
    });
  }
});
