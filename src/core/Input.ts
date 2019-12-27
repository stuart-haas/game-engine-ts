export class Input {

  private pressed:object = {};

  constructor() {
      window.onkeyup = this.onKeyup.bind(this);
      window.onkeydown = this.onKeydown.bind(this);
  }

  isDown(keyCode:number) {
      return this.pressed[keyCode];
  }
    
  onKeydown(event:KeyboardEvent) {
      this.pressed[event.keyCode] = true;
  }
    
  onKeyup(event:KeyboardEvent) {
      delete this.pressed[event.keyCode];
  }
}