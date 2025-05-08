// Call this function when user clicks "Edit"
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

    // Save updates when form is submitted
    eventForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!editingEventId) return;
  
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value;
  
    let events = getEventsFromStorage();
  
    events = events.map(event => {
      if (event.id === editingEventId) {
        return { ...event, title, description, date, time, location };
      }
      return event;
    });

    saveEventsToStorage(events);
  alert('Event updated successfully!');
  eventForm.reset();
  editingEventId = null;

  if (typeof displayEvents === 'function') displayEvents();
});

window.editEvent = editEvent;