import { Entity } from './Entity';
import { Input } from '@core/Input';
import { Shape } from '@render/Shape';
import { Math2 } from '@math/Math2';
import { Vector } from '@math/Vector';
import { Map } from '@core/Map';

enum Keys {
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
}

export class Player extends Entity {

  private map: Map;
  private input: Input
  private offset: Vector = new Vector(79, 79);

  public constructor() {
    super();
    this.map = Map.getInstance();
    this.input = new Input();
  }

  public update(): void {
    if (this.input.isDown(Keys.Up)) this.acceleration.y -= this.maxSpeed;
    if (this.input.isDown(Keys.Left)) this.acceleration.x -= this.maxSpeed;
    if (this.input.isDown(Keys.Down)) this.acceleration.y += this.maxSpeed;
    if (this.input.isDown(Keys.Right)) this.acceleration.x += this.maxSpeed;

    super.update();

    this.position.x = Math2.clamp(this.position.x, this.offset.x, this.map.width - this.offset.x);
    this.position.y = Math2.clamp(this.position.y, this.offset.y, this.map.height - this.offset.y);
  }

  public render(): void {
      Shape.rectangle(this.position, 32, 32, 'red');
  }
}