class FunctionCooldownManager {
  constructor(storageKey, timelimitTM) {
    this.storageKey = storageKey;
    this.taskResult = `${storageKey}-result`;
    this.timelimitTM = timelimitTM;
  }

  getLastRunTimestamps() {
    return localStorage.getItem(this.storageKey);
  }

  setLastRunTimestamps() {
    localStorage.setItem(this.storageKey, Date.now());
  }

  getTaskResult() {
    return localStorage.getItem(this.taskResult);
  }

  setTaskResult(result) {
    localStorage.setItem(this.taskResult, result);
  }

  hasRecentExecution() {
    const lastRun = this.getLastRunTimestamps();
    if (!lastRun) return false;

    const now = Date.now();
    return now - parseInt(lastRun, 10) < this.timelimitTM;
  }

  async executeAsync(task) {
    if (this.hasRecentExecution()) {
      return this.getTaskResult();
    }

    this.setLastRunTimestamps();
    const res = await task();
    this.setTaskResult(res);
    return res;
  }

  executeSync(task) {
    if (this.hasRecentExecution()) {
      return this.getTaskResult();
    }

    this.setLastRunTimestamps();
    const res = task();
    this.setTaskResult(res);
    return res;
  }
}

module.exports = { FunctionCooldownManager };
