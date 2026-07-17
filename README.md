## 📅 StudyHall — College Class Timetable

A sleek, modern, and interactive **College Class Timetable Web App** designed to simplify how students track their weekly class schedule. Originally a basic HTML table, this project has undergone a massive **v2.0 Redesign**, transforming it into a high-performance **Single Page Application (SPA)** with a beautiful, responsive UI.

🌐 **Live Demo:** [https://aiml-time-table.vercel.app/](https://aiml-time-table.vercel.app/)

---

### 🚀 What's New in v2.0 (The Complete Makeover)

This project has been completely rebuilt from the ground up to mimic a native application experience:
* **Single Page Application (SPA)**: True app-like experience with Hash Routing. Clicking between Dashboard, Schedule, and Settings instantly swaps content without reloading the page.
* **Modern UI/UX**: Completely redesigned using **Tailwind CSS**, featuring a clean, flat aesthetic, dynamic sidebars, and responsive mobile navigation bars.
* **Dynamic Settings & Profiles**: Users can customize their Profile Name, Major, and Avatar. Data is seamlessly synced across the app using LocalStorage.
* **Smart Filtering**: Built-in "Group X" and "Group Y" filters for lab classes so students only see the timetable relevant to them.
* **Interactive Timeline**: A visual, grid-based daily timeline with a real-time progress indicator showing the current time.

---

### 🔧 Tech Stack

* **HTML5 & Vanilla JavaScript** – Core front-end logic and SPA routing engine.
* **Tailwind CSS v4** – Utility-first CSS framework for rapid, responsive UI development.
* **Local Storage API** – Client-side database for saving user settings and preferences.
* **Vercel** – Optimized for instant edge deployments.

---

### ✅ Key Features

| Feature                   | Description                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------- |
| **Bento-Grid Dashboard**  | A modern "Today" view summarizing upcoming classes and immediate deadlines.             |
| **Flicker-Free SPA Navigation** | Custom built JavaScript router handles page transitions instantly.                      |
| **Responsive Design**     | Adapts perfectly to desktop (fixed sidebar) and mobile (bottom app bar).                |
| **Class Details Modal**   | Click on any class block to view a slide-in modal with full teacher and room details.   |
| **Custom Settings**       | Personalize the app with your name, student ID, and custom profile picture.             |

---

### 🚀 Local Development

To run this project locally, you will need Node.js installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rishavroy-2006/Class-Time-Table.git
   cd Class-Time-Table
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the Tailwind CSS (Optional, runs automatically on deploy):**
   ```bash
   npm run build
   ```

4. **Start a local server:**
   Because this is an SPA, you must run it through a local HTTP server (opening the HTML file directly will break the routing).
   ```bash
   npx serve . -p 3000
   ```
   Open `http://localhost:3000` in your browser.

---

### 🌍 Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).
* It includes a `vercel.json` file configured for clean URLs and aggressive static caching.
* Vercel will automatically detect the `package.json` and run the Tailwind build script (`npm run build`) before deploying.

---

### 🔗 Access & Contribution:

* 💡 Contributions are welcome! Suggestions for new features like Dark Mode, offline PWA support, or Google Calendar syncing can be added via GitHub issues or pull requests.
