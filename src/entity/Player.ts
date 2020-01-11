import { Entity } from './Entity';
import { Input, Keys } from '@core/Input';
import { Shape } from '@draw/Shape';
import { Mathf } from '@math/Mathf';
import { Vector } from '@math/Vector';
import { Graph, LayerId } from 'map/Graph';
import { Collision } from '@physics/Collision';
import { AStar } from '@behavior/AStar';

export class Player extends Entity {

  private graph:Graph;
  private input:Input
  private offset:Vector = new Vector(32, 32);
  private lastPosition:Vector = new Vector();

  public constructor() {
    super();
    this.graph = Graph.getInstance();
    this.input = new Input();
  }

  public update():void {

    this.lastPosition = this.position.clone();
    
    if (this.input.isDown(Keys.Up)) this.acceleration.y -= this.maxVelocity;
    if (this.input.isDown(Keys.Left)) this.acceleration.x -= this.maxVelocity;
    if (this.input.isDown(Keys.Down)) this.acceleration.y += this.maxVelocity;
    if (this.input.isDown(Keys.Right)) this.acceleration.x += this.maxVelocity;

    super.update();

    if(this.lastPosition.x !== this.position.x || this.lastPosition.y !== this.position.y) {
      Collision.detect(this, LayerId.Collision, 0, function(source:Entity, target:Entity) {
        Collision.resolve(source, target);
      });
    }

    this.position.x = Mathf.clamp(this.position.x, this.offset.x, this.graph.width - this.offset.x * 2);
    this.position.y = Mathf.clamp(this.position.y, this.offset.y, this.graph.height - this.offset.y * 2);
  }

  public render():void {
    Shape.rectangle(this.position, 32, 32, 'blue');
  }
}