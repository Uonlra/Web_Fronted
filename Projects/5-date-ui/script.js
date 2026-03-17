const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const input = document.getElementById("date-input");
const toggleCalendarBtn = document.getElementById("toggle-calendar");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const daysGrid = document.getElementById("days-grid");
const selectedLabel = document.getElementById("selected-label");
const todayBtn = document.getElementById("today-btn");
const calendarPanel = document.querySelector(".calendar-panel");

const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
let selectedDate = null;
let isCalendarOpen = true;

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function toInputValue(date) {
  return `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function toLabelValue(date) {
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function buildMonthOptions() {
  monthNames.forEach((name, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = name;
    monthSelect.append(option);
  });
}

function buildYearOptions() {
  const startYear = today.getFullYear() - 80;
  const endYear = today.getFullYear() + 20;

  for (let year = startYear; year <= endYear; year += 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.append(option);
  }
}

function setSelectedDate(date) {
  selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  input.value = toInputValue(selectedDate);
  selectedLabel.textContent = `Selected: ${toLabelValue(selectedDate)}`;
}

function renderCalendar() {
  monthSelect.value = String(viewMonth);
  yearSelect.value = String(viewYear);

  daysGrid.innerHTML = "";

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();
  const totalSlots = 42;

  for (let slot = 0; slot < totalSlots; slot += 1) {
    const dayNumber = slot - firstDayIndex + 1;

    if (dayNumber < 1 || dayNumber > totalDays) {
      const filler = document.createElement("span");
      filler.className = "muted";
      daysGrid.append(filler);
      continue;
    }

    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.className = "day";
    dayButton.textContent = String(dayNumber);
    dayButton.setAttribute("aria-label", `${monthNames[viewMonth]} ${dayNumber}, ${viewYear}`);

    const isToday =
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      dayNumber === today.getDate();

    if (isToday) {
      dayButton.classList.add("today");
    }

    const isSelected =
      selectedDate &&
      viewYear === selectedDate.getFullYear() &&
      viewMonth === selectedDate.getMonth() &&
      dayNumber === selectedDate.getDate();

    if (isSelected) {
      dayButton.classList.add("active");
      dayButton.setAttribute("aria-pressed", "true");
    }

    dayButton.addEventListener("click", () => {
      setSelectedDate(new Date(viewYear, viewMonth, dayNumber));
      renderCalendar();
    });

    daysGrid.append(dayButton);
  }
}

function updateView(monthDelta) {
  viewMonth += monthDelta;

  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  }

  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  }

  renderCalendar();
}

function toggleCalendar() {
  isCalendarOpen = !isCalendarOpen;
  calendarPanel.classList.toggle("is-hidden", !isCalendarOpen);
  toggleCalendarBtn.setAttribute("aria-expanded", String(isCalendarOpen));
}

function init() {
  buildMonthOptions();
  buildYearOptions();

  setSelectedDate(today);
  renderCalendar();

  prevMonthBtn.addEventListener("click", () => updateView(-1));
  nextMonthBtn.addEventListener("click", () => updateView(1));

  monthSelect.addEventListener("change", () => {
    viewMonth = Number(monthSelect.value);
    renderCalendar();
  });

  yearSelect.addEventListener("change", () => {
    viewYear = Number(yearSelect.value);
    renderCalendar();
  });

  todayBtn.addEventListener("click", () => {
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    setSelectedDate(today);
    renderCalendar();
  });

  toggleCalendarBtn.addEventListener("click", toggleCalendar);
}

init();
