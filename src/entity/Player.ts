import { Input, Keys } from '@core/Input';
import { Shape } from '@draw/Shape';
import { Mathf } from '@math/Mathf';
import { Vector } from '@math/Vector';
import { Map, LayerId } from '@core/Map';
import { Collision } from '@physics/Collision';
import { PathManager } from '@pathfinding/PathManager';
import { EventManager, Event } from '@events/EventManager';
import { Entity } from './Entity';

export class Player extends Entity {

  private input:Input
  private offset:Vector = new Vector(32, 32);
  private lastPosition:Vector = new Vector();

  public constructor() {
    super();
    this.input = new Input();
    //PathManager.requestPath(this.position, new Vector(700, 600), this.onPathFound.bind(this));
  }

  private onPathFound(path:Vector[], success:boolean):void {
    console.log(path, success);

    var pathIndex:number = 0;

    EventManager.instance.subscribe(Event.UPDATE, (delta) => {
      var target:Vector = path[pathIndex];

      if(target == undefined) return;

      this.lastPosition = this.position.clone();

      if(this.position.dist(target) <= 10) {
        pathIndex ++;
      }

      if(pathIndex < path.length) {
        this.acceleration = Vector.seek(this.position, target, this.maxVelocity);
      }
    });
  }

  public update(delta:number):void {

    this.lastPosition = this.position.clone();
    
    if (this.input.isDown(Keys.Up)) this.acceleration.y -= this.maxVelocity;
    if (this.input.isDown(Keys.Left)) this.acceleration.x -= this.maxVelocity;
    if (this.input.isDown(Keys.Down)) this.acceleration.y += this.maxVelocity;
    if (this.input.isDown(Keys.Right)) this.acceleration.x += this.maxVelocity;

    super.update(delta);

    if(!this.lastPosition.equals(this.position)) {
      Collision.detect(this, LayerId.Collision, 0, function(source:Entity, target:Entity) {
        Collision.resolve(source, target);
      });
    }

    this.position.x = Mathf.clamp(this.position.x, this.offset.x, Map.instance.width - this.offset.x * 2);
    this.position.y = Mathf.clamp(this.position.y, this.offset.y, Map.instance.height - this.offset.y * 2);
  }

  public render():void {
    Shape.rectangle(this.position, 32, 32, 'blue');
  }
}