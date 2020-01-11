import { Entity } from './Entity';
import { Input, Keys } from '@core/Input';
import { Shape } from '@draw/Shape';
import { Mathf } from '@math/Mathf';
import { Vector } from '@math/Vector';
import { Map, LayerId } from '@core/Map';
import { Collision } from '@physics/Collision';
import { PathManager } from '@pathfinding/PathManager';
import { Engine } from '../core/Engine';
import { EventDispatcher } from '../events/EventDispatcher';
import { deflate } from 'zlib';

export class Player extends Entity {

  private map:Map;
  private input:Input
  private offset:Vector = new Vector(32, 32);
  private lastPosition:Vector = new Vector();
  private dispatcher:EventDispatcher;

  public constructor() {
    super();
    this.input = new Input();
    this.map = Map.getInstance();
    this.dispatcher = EventDispatcher.getInstance();
    PathManager.requestPath(this.position, new Vector(700, 600), this.onPathFound.bind(this));
  }

  private onPathFound(path:Vector[], success:boolean):void {
    console.log(path, success);
    this.dispatcher.subscribe("update", (delta) => {
      //this.position.add(new Vector(1, 1));
    });
  }

  public update():void {

    this.lastPosition = this.position.clone();
    
    if (this.input.isDown(Keys.Up)) this.acceleration.y -= this.maxVelocity;
    if (this.input.isDown(Keys.Left)) this.acceleration.x -= this.maxVelocity;
    if (this.input.isDown(Keys.Down)) this.acceleration.y += this.maxVelocity;
    if (this.input.isDown(Keys.Right)) this.acceleration.x += this.maxVelocity;

    super.update();

    if(!this.lastPosition.equals(this.position)) {
      Collision.detect(this, LayerId.Collision, 0, function(source:Entity, target:Entity) {
        Collision.resolve(source, target);
      });
    }

    this.position.x = Mathf.clamp(this.position.x, this.offset.x, this.map.width - this.offset.x * 2);
    this.position.y = Mathf.clamp(this.position.y, this.offset.y, this.map.height - this.offset.y * 2);
  }

  public render():void {
    Shape.rectangle(this.position, 32, 32, 'blue');
  }
}