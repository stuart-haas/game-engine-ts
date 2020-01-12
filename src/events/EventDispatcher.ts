export class EventDispatcher {

  private static instance:EventDispatcher;

  public static getInstance() {
    if(!EventDispatcher.instance) {
      EventDispatcher.instance = new EventDispatcher();
    }
    return EventDispatcher.instance;
  }

  private events:any;

  constructor() {
    this.events = {};
  }

  subscribe(event:string, callback:(data?:any) => any) {
    if (this.events[event] === undefined) {
      this.events[event] = {
        listeners:[]
      };
    }
    this.events[event].listeners.push(callback);
  }

  unsubscribe(event:string, callback:(data?:any) => any) {
    if (this.events[event] === undefined) {
      return false;
    }
    this.events[event].listeners = this.events[event].listeners.filter(
      (listener:string) => {
        return listener.toString() !== callback.toString();
      }
    );
  }

  publish(event:string, data?:any) {
    if (this.events[event] === undefined) {
      return false;
    }
    this.events[event].listeners.forEach((listener:any) => {
      listener(data);
    });
  }
}