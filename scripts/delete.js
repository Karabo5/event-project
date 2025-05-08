window.deleteEvent = (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    let events = getEvents();
    events = events.filter(e => e.id !== id);
    saveEvents(events);
    renderManageEvents();
    renderHomeEvents();
  };