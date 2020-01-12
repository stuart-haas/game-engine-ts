export class Event {

  public static UPDATE:string = "UPDATE";

}

export class EventManager {

  public static instance:EventManager;

  public static createInstance() {
    if(!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
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