// script will be used to merge all events and final modification so they work as one
const eventForm = document.getElementById('eventForm');

function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}