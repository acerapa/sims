class FunctionCooldownManager {
  constructor(storageKey, timelimitTM) {
    this.storageKey = storageKey;
    this.timelimitTM = timelimitTM;
  }

  getLastRunTimestamps() {
    return localStorage.getItem(this.storageKey);
  }

  setLastRunTimestamps() {
    localStorage.setItem(this.storageKey, Date.now());
  }

  hasRecentExecution() {
    const lastRun = this.getLastRunTimestamps();
    if (!lastRun) return false;

    const now = Date.now();
    return now - parseInt(lastRun, 10) < this.timelimitTM;
  }

  execute(task) {
    if (this.hasRecentExecution()) {
      return true;
    }

    this.setLastRunTimestamps();
    return task();
  }
}

module.exports = { FunctionCooldownManager };
