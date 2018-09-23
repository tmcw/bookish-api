// A centralized logging method that allows us to route
// console.log-like messages to any output: in this case,
// back to the response.
class Context {
  constructor(messages = [], prefix = "") {
    this.messages = messages;
    this.timers = new Map();
    this.pfx = prefix;
  }
  prefix(pfx) {
    return new Context(this.messages, pfx);
  }
  log(msg) {
    this.messages.push(`${new Date().toISOString()} ${this.pfx} ${msg}`);
  }
  time(msg) {
    this.timers.set(msg, Date.now());
  }
  timeEnd(msg) {
    const before = this.timers.get(msg);
    if (!before) {
      console.error(`Timer not found for ${msg}`);
    }
    this.log(`${msg} (${Date.now() - before}ms)`);
    this.timers.delete(msg);
  }
  getMessages() {
    if (this.timers.size) {
      console.error(`Stray timers detected: ${Array.from(timers.keys())}`);
    }
    return this.messages;
  }
}

module.exports = Context;
