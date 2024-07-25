class Event {
  static events = [];

  static on(event, callback, append = false) {
    const evt = this.events.find((v) => v.event == event);
    if (evt) {
      if (append) {
        let callbacks = [];
        if (Array.isArray(evt.callback)) {
          callbacks.push(...evt.callback);
        } else {
          callbacks.push(evt.callback);
        }
        callbacks.push(callback);

        evt.callback = callbacks;
      } else {
        evt.callback = callback;
      }
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
      if (Array.isArray(evt.callback)) {
        evt.callback.map((fn) => (fn.length ? fn(data) : fn()));
      } else {
        return evt.callback.length ? evt.callback(data) : evt.callback();
      }
    }
  }
}

export default Event;
