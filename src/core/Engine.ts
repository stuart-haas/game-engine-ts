import { context, Canvas } from "./Canvas";
import { Player } from '@entity/Player';
import { Spawner } from './Spawner';
import { Map, Layer } from '@core/Map';
import { Camera } from './Camera';
import { EntityManager } from './EntityManager';
import { Entity } from '@entity/Entity';
import { MapResource } from './Map';
import { Profiler } from "./Profiler";
import { EventManager, Event } from '@events/EventManager';

export class Engine {

  private canvas:HTMLCanvasElement;
  private currentTime:number = Date.now();
  private lastTime:number = this.currentTime;
  private delta:number = 0;
  private timer:number = Date.now();
  private frames:number = 0;

  public constructor() {
    Map.createInstance();
    Camera.createInstance();
    EntityManager.createInstance();
    Spawner.createInstance();
    Profiler.createInstance();
    EventManager.createInstance();
  }

  public resize():void {
    if(this.canvas !== undefined) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.outerHeight;
    }
  }

  public start():void {

    const self = this;

    this.canvas = Canvas.initialize();

    Canvas.WIDTH = this.canvas.width;
    Canvas.HEIGHT = this.canvas.height;

    Map.instance.load([
      new MapResource("resources/tilemaps/Tilemap_Path Layer.csv", "resources/tilesets/tallgrass.png", Layer.Path), 
      new MapResource("resources/tilemaps/Tilemap_Collision Layer.csv", "resources/tilesets/fence.png", Layer.Collision)      
    ]).then(data => {
      self.ready();
    })
  }

  private ready():void {
    EntityManager.instance.addEntity(new Player());
    Camera.instance.setTarget(EntityManager.instance.getEntity(0).position);

    this.update();
  }

  private update():void {

    this.currentTime = Date.now();
    this.delta = (this.currentTime - this.lastTime) / 1000;

    context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
    context.save();
    
    Camera.instance.update(this.delta);

    Map.instance.render();

    EntityManager.instance.update(this.delta);

    Spawner.instance.update();

    this.frames ++;

    if(Date.now() - this.timer > 1000) {
      this.timer += 1000;
      Profiler.FPS = this.frames;
      this.frames = 0;
    }

    Profiler.instance.update();

    EventManager.instance.publish(Event.UPDATE, this.delta);

    this.lastTime = this.currentTime;

    context.restore();

    window.requestAnimationFrame(this.update.bind(this));
  }
}