const form = document.querySelector('#activity-form');
const list = document.querySelector('#activity-list');
const emptyState = document.querySelector('#empty-state');
const message = document.querySelector('#form-message');
const storageKey = 'practica-activities';
const dateInput = document.querySelector('#activity-date');

function todayLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

dateInput.min = todayLocal();

function loadActivities() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

let activities = loadActivities();

function render() {
  list.replaceChildren();
  emptyState.hidden = activities.length > 0;
  for (const activity of activities) {
    const item = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = `${activity.title} · ${activity.date}`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Eliminar';
    remove.setAttribute('aria-label', `Eliminar ${activity.title}`);
    remove.addEventListener('click', () => {
      activities = activities.filter((entry) => entry.id !== activity.id);
      localStorage.setItem(storageKey, JSON.stringify(activities));
      render();
    });
    item.append(label, remove);
    list.append(item);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  const date = form.elements.date.value;
  if (!title || !date) {
    message.textContent = 'Completa la actividad y la fecha.';
    return;
  }
  if (date < todayLocal()) {
    message.textContent = 'Selecciona una fecha de hoy en adelante.';
    dateInput.focus();
    return;
  }
  activities.push({ id: crypto.randomUUID(), title, date });
  localStorage.setItem(storageKey, JSON.stringify(activities));
  message.textContent = '';
  form.reset();
  render();
});

render();
