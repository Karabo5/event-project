const eventForm = document.getElementById('eventForm');
const eventNameInput = document.getElementById('eventName');
const eventList = document.getElementById('eventList');

// ========== Utility ==========

function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

// ========== Create ==========

eventForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = eventNameInput.value.trim();
  if (!name) return;

  const newEvent = {
    id: Date.now(),
    name
  };

  const events = getEventsFromStorage();
  events.push(newEvent);
  saveEventsToStorage(events);
  eventNameInput.value = '';
  renderEvents();
});

// ========== Read + Render ==========

function renderEvents() {
  const events = getEventsFromStorage();
  eventList.innerHTML = '';

  events.forEach(event => {
    const li = document.createElement('li');
    li.textContent = event.name;

    // Update Button
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Update';
    updateBtn.onclick = () => {
      const newName = prompt('Enter new name:', event.name);
      if (newName) updateEvent(event.id, newName);
    };

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteEventById(event.id);

    li.appendChild(updateBtn);
    li.appendChild(deleteBtn);
    eventList.appendChild(li);
  });
}

// ========== Update ==========

function updateEvent(id, newName) {
  const events = getEventsFromStorage();
  const index = events.findIndex(event => event.id === id);
  if (index !== -1) {
    events[index].name = newName;
    saveEventsToStorage(events);
    renderEvents();
  }
}

// ========== Delete ==========

function deleteEventById(id) {
  let events = getEventsFromStorage();
  events = events.filter(event => event.id !== id);
  saveEventsToStorage(events);
  renderEvents();
}

// Initial render
renderEvents();
