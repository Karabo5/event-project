const eventForm = document.getElementById('eventForm');

function getEventsFromStorage() {
  return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEventsToStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}
function showSuccessful(event) {
  event.preventDefault(); 
  document.getElementById("overlay").style.display = "flex";
  document.body.style.overflow = 'hidden';
}

function closeCustomAlert() {
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = '';
}
