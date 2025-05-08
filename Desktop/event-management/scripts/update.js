function editEvent(id) {
    const events = getEventsFromStorage();
    const event = events.find(e => e.id === id);

    if (event) {
        // Call this function when user clicks "Edit"
        document.getElementById('title').value = event.title;
        document.getElementById('description').value = event.description;
        document.getElementById('date').value = event.date;
        document.getElementById('time').value = event.time;
        document.getElementById('location').value = event.location;
    
        editingEventId = id;
      }
    }