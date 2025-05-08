//for 
const eventForm = document.getElementById('eventForm');
let editingEventId = null;

function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

//click button when user click button
function editEvent(id) {
  const events = getEventsFromStorage();
  const event = events.find(e => e.id === id);
  if (event) {
    document.getElementById('title').value = event.title;
    document.getElementById('description').value = event.description;
    document.getElementById('date').value = event.date;
    document.getElementById('time').value = event.time;
    document.getElementById('location').value = event.location;
    editingEventId = id;
  }
}

eventForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!editingEventId) return;

  const updated = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    location: document.getElementById('location').value,
  };

  const events = getEventsFromStorage().map(event =>
    event.id === editingEventId ? { ...event, ...updated } : event
  );

  saveEventsToStorage(events);
  alert("Event updated successfully!");
  eventForm.reset();
  editingEventId = null;

  if (typeof displayEvents === 'function') displayEvents();
});

window.editEvent = editEvent;
