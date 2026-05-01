/**
 * clockApp Object
 * Stores all functional logic and application state
 */
const clockApp = {
  is24Hour: true,
  isDarkMode: false,
  alarmTime: null,
  alarmTriggered: false,

  // Converts computer time into our formatted string
  formatTime: function () {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    let ampm = "";

    if (!this.is24Hour) {
      ampm = `<span class="text-xl ml-2 font-black opacity-30">${hours >= 12 ? "PM" : "AM"}</span>`;
      hours = hours % 12 || 12;
    }

    hours = String(hours).padStart(2, "0");
    const separator = `<span class="pulse mx-0.5">:</span>`;

    return `${hours}${separator}${minutes}${separator}${seconds}${ampm}`;
  },

  // Checks if current time matches the set alarm
  checkAlarm: function (currentHours, currentMinutes) {
    if (!this.alarmTime) return;

    const currentTimeStr = `${String(currentHours).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`;
    const modal = document.getElementById("alarm-modal");
    const modalTime = document.getElementById("alarm-time-display");
    const display = document.getElementById("clock-display");

    if (currentTimeStr === this.alarmTime) {
      // Trigger visual alarm (Orange color)
      display.classList.add("text-amber-500");
      display.classList.remove("text-pink-600", "text-pink-400");

      if (!this.alarmTriggered) {
        this.alarmTriggered = true;
        modal.classList.remove("hidden"); // Show Popup
        modalTime.innerText = currentTimeStr;
      }
    } else {
      // Reset trigger once the minute passes
      this.alarmTriggered = false;
      display.classList.remove("text-amber-500");
      display.classList.add(
        this.isDarkMode ? "text-pink-400" : "text-pink-600",
      );
    }
  },

  // Main update loop
  updateDisplay: function () {
    const now = new Date();
    const display = document.getElementById("clock-display");

    if (display) {
      display.innerHTML = this.formatTime();
      this.checkAlarm(now.getHours(), now.getMinutes());
    }
  },
};

/**
 * Event Initialization
 */
document.addEventListener("DOMContentLoaded", () => {
  // Select elements
  const alarmInput = document.getElementById("alarm-input");
  const closeBtn = document.getElementById("close-alarm");
  const formatBtn = document.getElementById("format-btn");
  const themeBtn = document.getElementById("theme-btn");
  const body = document.getElementById("body");
  const card = document.getElementById("clock-card");
  const label = document.getElementById("label");
  const modal = document.getElementById("alarm-modal");

  // 1. Start the clock
  clockApp.updateDisplay();
  setInterval(() => clockApp.updateDisplay(), 1000);

  // 2. Alarm Input Listener
  alarmInput?.addEventListener("change", (e) => {
    clockApp.alarmTime = e.target.value;
    clockApp.alarmTriggered = false; // Reset if new time is set
  });

  // 3. Dismiss Alarm Popup
  closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // 4. Toggle 12/24h Format
  formatBtn?.addEventListener("click", () => {
    clockApp.is24Hour = !clockApp.is24Hour;
    clockApp.updateDisplay();
  });

  // 5. Toggle Light/Dark Mode
  themeBtn?.addEventListener("click", () => {
    clockApp.isDarkMode = !clockApp.isDarkMode;

    if (clockApp.isDarkMode) {
      body.className =
        "bg-slate-dark min-h-screen flex items-center justify-center transition-all duration-700";
      card.className =
        "bg-black/60 backdrop-blur-md border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-lg w-full mx-4 transition-all duration-700";
      themeBtn.className =
        "w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-2xl transition-all active:scale-95 font-bold text-xs uppercase tracking-widest";
      label.classList.replace("text-slate-500", "text-slate-600");
    } else {
      body.className =
        "bg-slate-light min-h-screen flex items-center justify-center transition-all duration-700";
      card.className =
        "bg-white/80 backdrop-blur-md border border-slate-300 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-lg w-full mx-4 transition-all duration-700";
      themeBtn.className =
        "w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-2xl transition-all active:scale-95 font-bold text-xs uppercase tracking-widest";
      label.classList.replace("text-slate-600", "text-slate-500");
    }
    clockApp.updateDisplay();
  });
});
