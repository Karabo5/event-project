const eventForm = document.getElementById('eventForm');

function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

function saveEvent() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const location = document.getElementById('location').value;

  const events = getEventsFromStorage();

  // Create a unique ID based on timestamp
  const newEvent = {
    id: Date.now().toString(),
    title,
    description,
    date,
    time,
    location
  };

  events.push(newEvent);
  saveEventsToStorage(events);

  // Reset form after saving
  eventForm.reset();

  // Show confirmation overlay
  document.getElementById("overlay").style.display = "flex";
  document.body.style.overflow = 'hidden';
}

function closeCustomAlert() {
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = '';
}

eventForm.addEventListener('submit', function (e) {
  e.preventDefault();

  if (eventForm.checkValidity()) {
    saveEvent();
  } else {
    eventForm.reportValidity();
  }
});
