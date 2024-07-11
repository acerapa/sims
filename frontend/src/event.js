class Event {
  static events = [];

  static on(event, callback) {
    const evt = this.events.find((v) => v.event == event);
    if (evt) {
      evt.callback = callback;
    } else {
      this.events.push({
        event,
        callback,
      });
    }
  }

  static emit(event, data = null) {
    const evt = this.events.find((v) => v.event == event);
    if (evt) {
      return evt.callback.length ? evt.callback(data) : evt.callback();
    }
  }
}

export default Event;
