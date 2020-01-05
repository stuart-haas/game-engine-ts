import { Entity } from './Entity';
import { Input } from '@core/Input';
import { Shape } from '@render/Shape';
import { Mathf } from '@math/Mathf';
import { Vector } from '@math/Vector';
import { Graph, Layer } from 'map/Graph';
import { Collision } from '@physics/Collision';
import { AStar } from '@behavior/AStar';

enum Keys {
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
}

export class Player extends Entity {

  private map:Graph;
  private input:Input
  private offset:Vector = new Vector(79, 79);
  private lastPosition:Vector = new Vector();
  private astar: AStar;

  public constructor() {
    super();
    this.map = Graph.getInstance();
    this.input = new Input();
    this.astar = new AStar();
  }

  public update():void {

    this.lastPosition = this.position.clone();
    
    if (this.input.isDown(Keys.Up)) this.acceleration.y -= this.maxVelocity;
    if (this.input.isDown(Keys.Left)) this.acceleration.x -= this.maxVelocity;
    if (this.input.isDown(Keys.Down)) this.acceleration.y += this.maxVelocity;
    if (this.input.isDown(Keys.Right)) this.acceleration.x += this.maxVelocity;

    super.update();

    if(this.lastPosition.x !== this.position.x || this.lastPosition.y !== this.position.y) {
      this.astar.search(this.position, new Vector(400, 400), Layer.Collision);
      Collision.detect(this, Layer.Collision, 0, function(source:Entity, target:Entity) {
        Collision.resolve(source, target);
      });
    }

    this.position.x = Mathf.clamp(this.position.x, this.offset.x, this.map.width - this.offset.x);
    this.position.y = Mathf.clamp(this.position.y, this.offset.y, this.map.height - this.offset.y);
  }

  public render():void {
    Shape.rectangle(this.position, 32, 32, 'green');
  }
}