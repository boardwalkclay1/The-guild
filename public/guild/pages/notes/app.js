// =========================
// 1. IndexedDB Setup
// =========================

const DB_NAME = 'tradingNotesDB';
const DB_VERSION = 1;
let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('dailyNotes')) {
        const store = db.createObjectStore('dailyNotes', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('byDate', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains('alerts')) {
        const store = db.createObjectStore('alerts', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('byDate', 'date', { unique: false });
        store.createIndex('byTime', 'triggerTime', { unique: false });
      }

      if (!db.objectStoreNames.contains('charts')) {
        const store = db.createObjectStore('charts', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('byTicker', 'ticker', { unique: false });
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
}

function dbTransaction(storeName, mode, callback) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = callback(store);

    tx.oncomplete = () => resolve(result);
    tx.onerror = (e) => reject(e.target.error);
  });
}

// =========================
// 2. Utility Functions
// =========================

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getTodayDateStr() {
  return formatDate(new Date());
}

function getYesterdayDateStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

async function getSetting(key) {
  return dbTransaction('settings', 'readonly', (store) => {
    return new Promise((resolve) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => resolve(null);
    });
  });
}

async function setSetting(key, value) {
  return dbTransaction('settings', 'readwrite', (store) => {
    store.put({ key, value });
  });
}

// =========================
// 3. Daily Notes System
// =========================

async function addDailyNote(note) {
  return dbTransaction('dailyNotes', 'readwrite', (store) => {
    store.add(note);
  });
}

async function getNotesByDate(dateStr) {
  return dbTransaction('dailyNotes', 'readonly', (store) => {
    return new Promise((resolve) => {
      const index = store.index('byDate');
      const range = IDBKeyRange.only(dateStr);
      const req = index.openCursor(range);
      const results = [];
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => resolve([]);
    });
  });
}

async function getPinnedNotesForDate(dateStr) {
  const notes = await getNotesByDate(dateStr);
  return notes.filter((n) => n.pinToDashboard);
}

async function getAllNotesForDate(dateStr) {
  return getNotesByDate(dateStr);
}

// =========================
// 4. Weekly Auto-Delete System
// =========================

async function weeklyCleanupIfNeeded() {
  const todayStr = getTodayDateStr();
  const weekKey = getWeekKey(todayStr);
  const lastWeekKey = await getSetting('lastWeekKey');

  if (lastWeekKey === weekKey) return;

  if (lastWeekKey) {
    const shouldSave = window.confirm(
      `Do you want to save notes from week ${lastWeekKey}? (OK = Save, Cancel = Delete unsaved days)`
    );

    if (!shouldSave) {
      await deleteUnsavedDaysForWeek(lastWeekKey);
    }
  }

  await setSetting('lastWeekKey', weekKey);
}

async function deleteUnsavedDaysForWeek(weekKey) {
  return dbTransaction('dailyNotes', 'readwrite', (store) => {
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const note = cursor.value;
        const noteWeekKey = getWeekKey(note.date);
        if (noteWeekKey === weekKey && !note.saveDay) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
  });
}

// =========================
// 5. Dashboard Logic
// =========================

async function renderDashboard() {
  const todayStr = getTodayDateStr();
  const yesterdayStr = getYesterdayDateStr();

  const [todayPinned, yesterdayPinned, alerts] = await Promise.all([
    getPinnedNotesForDate(todayStr),
    getPinnedNotesForDate(yesterdayStr),
    getAllAlerts()
  ]);

  renderNotesList(document.getElementById('todayNotesList'), todayPinned);
  renderNotesList(document.getElementById('yesterdayNotesList'), yesterdayPinned);
  renderAlertsList(document.getElementById('alertsList'), alerts);
}

function renderNotesList(container, notes) {
  container.innerHTML = '';
  if (!notes || notes.length === 0) {
    const li = document.createElement('li');
    li.className = 'note-item';
    li.textContent = 'No notes.';
    container.appendChild(li);
    return;
  }

  notes.forEach((note) => {
    const li = document.createElement('li');
    li.className = 'note-item';

    const header = document.createElement('div');
    header.className = 'note-item-header';

    const tickerSpan = document.createElement('span');
    tickerSpan.className = 'note-item-ticker';
    tickerSpan.textContent = note.ticker || 'No ticker';

    const dateSpan = document.createElement('span');
    dateSpan.textContent = note.date;

    header.appendChild(tickerSpan);
    header.appendChild(dateSpan);

    const body = document.createElement('div');
    body.className = 'note-item-body';
    body.textContent = note.text || '';

    const tags = document.createElement('div');
    tags.className = 'note-item-tags';
    const tagsArr = [];
    if (note.pinToDashboard) tagsArr.push('Pinned');
    if (note.saveDay) tagsArr.push('Saved Day');
    if (note.reminderTime) tagsArr.push(`Reminder @ ${note.reminderTime}`);
    tags.textContent = tagsArr.join(' • ');

    li.appendChild(header);
    li.appendChild(body);
    if (tagsArr.length > 0) li.appendChild(tags);

    container.appendChild(li);
  });
}

// =========================
// 6. Alerts Engine (time-based)
// =========================

async function addAlert(alert) {
  return dbTransaction('alerts', 'readwrite', (store) => {
    store.add(alert);
  });
}

async function getAllAlerts() {
  return dbTransaction('alerts', 'readonly', (store) => {
    return new Promise((resolve) => {
      const req = store.openCursor();
      const results = [];
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => resolve([]);
    });
  });
}

async function removeAlert(id) {
  return dbTransaction('alerts', 'readwrite', (store) => {
    store.delete(id);
  });
}

function renderAlertsList(container, alerts) {
  container.innerHTML = '';
  if (!alerts || alerts.length === 0) {
    const li = document.createElement('li');
    li.className = 'note-item';
    li.textContent = 'No alerts.';
    container.appendChild(li);
    return;
  }

  alerts
    .sort((a, b) => a.triggerTime - b.triggerTime)
    .forEach((alert) => {
      const li = document.createElement('li');
      li.className = 'note-item';

      const header = document.createElement('div');
      header.className = 'note-item-header';

      const msgSpan = document.createElement('span');
      msgSpan.textContent = alert.message || 'Alert';

      const timeSpan = document.createElement('span');
      const d = new Date(alert.triggerTime);
      timeSpan.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      header.appendChild(msgSpan);
      header.appendChild(timeSpan);

      const body = document.createElement('div');
      body.className = 'note-item-body';
      body.textContent = alert.ticker ? `Ticker: ${alert.ticker}` : '';

      li.appendChild(header);
      if (body.textContent) li.appendChild(body);

      container.appendChild(li);
    });
}

function scheduleAlert(alert) {
  const now = Date.now();
  const delay = alert.triggerTime - now;
  if (delay <= 0) return;

  setTimeout(async () => {
    showAlertNotification(alert);
    await removeAlert(alert.id);
    renderDashboard();
  }, delay);
}

function showAlertNotification(alert) {
  const msg = alert.message || 'Trading reminder';
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(msg, {
        body: alert.ticker ? `Ticker: ${alert.ticker}` : '',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification(msg, {
            body: alert.ticker ? `Ticker: ${alert.ticker}` : '',
          });
        } else {
          alertFallback(msg, alert.ticker);
        }
      });
    } else {
      alertFallback(msg, alert.ticker);
    }
  } else {
    alertFallback(msg, alert.ticker);
  }
}

function alertFallback(message, ticker) {
  window.alert(`${message}${ticker ? `\nTicker: ${ticker}` : ''}`);
}

async function scheduleExistingAlerts() {
  const alerts = await getAllAlerts();
  alerts.forEach(scheduleAlert);
}

// =========================
// 7. Chart Markup Tool
// =========================

let chartCanvas, chartCtx;
let drawing = false;
let lastX = 0;
let lastY = 0;

function initChartCanvas() {
  chartCanvas = document.getElementById('chartCanvas');
  chartCtx = chartCanvas.getContext('2d');

  chartCanvas.addEventListener('mousedown', startDrawing);
  chartCanvas.addEventListener('mousemove', draw);
  chartCanvas.addEventListener('mouseup', stopDrawing);
  chartCanvas.addEventListener('mouseleave', stopDrawing);

  document.getElementById('clearChart').addEventListener('click', clearChart);
  document.getElementById('saveChart').addEventListener('click', saveChartSnapshot);

  clearChart();
}

function startDrawing(e) {
  drawing = true;
  const rect = chartCanvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
}

function draw(e) {
  if (!drawing) return;
  const rect = chartCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  chartCtx.strokeStyle = '#22c55e';
  chartCtx.lineWidth = 2;
  chartCtx.lineCap = 'round';

  chartCtx.beginPath();
  chartCtx.moveTo(lastX, lastY);
  chartCtx.lineTo(x, y);
  chartCtx.stroke();

  lastX = x;
  lastY = y;
}

function stopDrawing() {
  drawing = false;
}

function clearChart() {
  chartCtx.fillStyle = '#020617';
  chartCtx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);
}

async function saveChartSnapshot() {
  const tickerInput = document.getElementById('chartTicker');
  const ticker = (tickerInput.value || '').trim().toUpperCase();
  if (!ticker) {
    window.alert('Please enter a ticker for this chart.');
    return;
  }

  const dataUrl = chartCanvas.toDataURL('image/png');
  const chart = {
    ticker,
    date: getTodayDateStr(),
    createdAt: Date.now(),
    imageData: dataUrl
  };

  await dbTransaction('charts', 'readwrite', (store) => {
    store.add(chart);
  });

  tickerInput.value = '';
  loadSavedCharts();
}

async function loadSavedCharts() {
  const container = document.getElementById('savedChartsContainer');
  container.innerHTML = '';

  const charts = await dbTransaction('charts', 'readonly', (store) => {
    return new Promise((resolve) => {
      const req = store.openCursor();
      const results = [];
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      req.onerror = () => resolve([]);
    });
  });

  if (charts.length === 0) {
    container.textContent = 'No saved charts.';
    return;
  }

  charts
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((chart) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'saved-chart-item';

      const meta = document.createElement('div');
      meta.className = 'saved-chart-meta';
      const d = new Date(chart.createdAt);
      meta.textContent = `${chart.ticker} • ${d.toLocaleString()}`;

      const img = document.createElement('img');
      img.className = 'saved-chart-img';
      img.src = chart.imageData;
      img.alt = `${chart.ticker} chart`;

      wrapper.appendChild(meta);
      wrapper.appendChild(img);
      container.appendChild(wrapper);
    });
}

// =========================
// 8. App Initialization
// =========================

async function handleNoteFormSubmit(event) {
  event.preventDefault();

  const dateInput = document.getElementById('noteDate');
  const tickerInput = document.getElementById('ticker');
  const noteTextInput = document.getElementById('noteText');
  const pinInput = document.getElementById('pinToDashboard');
  const saveDayInput = document.getElementById('saveDay');
  const reminderTimeInput = document.getElementById('reminderTime');
  const reminderMessageInput = document.getElementById('reminderMessage');

  const date = dateInput.value;
  if (!date) {
    window.alert('Please select a date.');
    return;
  }

  const note = {
    date,
    ticker: (tickerInput.value || '').toUpperCase(),
    text: noteTextInput.value || '',
    pinToDashboard: pinInput.checked,
    saveDay: saveDayInput.checked,
    reminderTime: reminderTimeInput.value || null,
    createdAt: Date.now()
  };

  await addDailyNote(note);

  if (note.reminderTime) {
    const [hour, minute] = note.reminderTime.split(':').map(Number);
    const triggerDate = new Date(date);
    triggerDate.setHours(hour, minute, 0, 0);

    const alertObj = {
      date,
      ticker: note.ticker,
      message: reminderMessageInput.value || `Reminder for ${note.ticker || 'note'}`,
      triggerTime: triggerDate.getTime(),
      createdAt: Date.now()
    };

    await addAlert(alertObj);
    scheduleAlert(alertObj);
  }

  tickerInput.value = '';
  noteTextInput.value = '';
  pinInput.checked = false;
  saveDayInput.checked = false;
  reminderTimeInput.value = '';
  reminderMessageInput.value = '';

  loadSelectedDateNotes();
  renderDashboard();
}

async function loadSelectedDateNotes() {
  const dateInput = document.getElementById('noteDate');
  const date = dateInput.value;
  if (!date) return;

  const notes = await getAllNotesForDate(date);
  const container = document.getElementById('selectedDateNotesList');
  renderNotesList(container, notes);
}

function initDateControls() {
  const dateInput = document.getElementById('noteDate');
  const todayStr = getTodayDateStr();
  dateInput.value = todayStr;
  dateInput.addEventListener('change', loadSelectedDateNotes);

  const currentDateLabel = document.getElementById('currentDate');
  currentDateLabel.textContent = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

async function initApp() {
  await openDB();
  await weeklyCleanupIfNeeded();
  initDateControls();
  initChartCanvas();

  document.getElementById('noteForm').addEventListener('submit', handleNoteFormSubmit);

  await renderDashboard();
  await loadSelectedDateNotes();
  await loadSavedCharts();
  await scheduleExistingAlerts();
}

window.addEventListener('load', () => {
  if ('Notification' in window) {
    Notification.requestPermission().catch(() => {});
  }
  initApp().catch((err) => console.error(err));
});
