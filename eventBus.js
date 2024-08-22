function EventBus() {
    this.events = {};
  }
  
  EventBus.prototype.on = function (eventName, handler, context) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push({
      handler: handler,
      context: context
    });
  };
  
  EventBus.prototype.trigger = function (eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(event => {
        event.handler.apply(event.context, args);
      });
    }
  };
//   确保在EventBus类中实现了triggerEvent方法。您可以使用以下示例代码将其添加到EventBus类中：
EventBus.prototype.triggerEvent = function (eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(event => {
        event.handler.apply(event.context, args);
      });
    }
  };
  EventBus.prototype.utilEvent = function (eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(event => {
        event.handler.apply(event.context, args);
      });
    }
  };
  // 将EventBus导出为模块
  module.exports = EventBus;