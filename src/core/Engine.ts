import { context, Canvas } from "./Canvas";
import { Player } from '@entity/Player';
import { Spawner } from './Spawner';
import { Map, LayerId } from '@core/Map';
import { Camera } from './Camera';
import { EntityManager } from './EntityManager';
import { Entity } from '@entity/Entity';
import { MapResource } from './Map';
import { Profiler } from "./Profiler";
import { EventDispatcher } from '../events/EventDispatcher';
import { Event } from '../events/Event';

export class Engine {

  public canvas:HTMLCanvasElement;
  public map:Map;
  public camera:Camera;
  public player:Entity;
  public entityManager:EntityManager;
  public spawner:Spawner;
  public profiler:Profiler;

  private currentTime:number = Date.now();
  private lastTime:number = this.currentTime;
  private delta:number = 0;
  private timer:number = Date.now();
  private fps:number = 60;
  private interval:number = 1000 / this.fps;
  private frames:number = 0;
  private eventDispatcher:EventDispatcher;

  public constructor() {
    this.map = Map.getInstance();
    this.camera = Camera.getInstance();
    this.entityManager = EntityManager.getInstance();
    this.spawner = Spawner.getInstance();
    this.profiler = Profiler.getInstance();
    this.eventDispatcher = EventDispatcher.getInstance();
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

    this.map.load([
      new MapResource("resources/tilemaps/Tilemap_Path Layer.csv", "resources/tilesets/tallgrass.png", LayerId.Path), 
      new MapResource("resources/tilemaps/Tilemap_Collision Layer.csv", "resources/tilesets/fence.png", LayerId.Collision)      
    ]).then(data => {
      self.ready();
    })
  }

  private ready():void {
    this.entityManager.addEntity(new Player());
    this.player = this.entityManager.getEntity(0);

    this.update();
  }

  private update():void {

    this.currentTime = Date.now();
    this.delta = (this.currentTime - this.lastTime);

    if(this.delta > this.interval) {

      context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
      context.save();
      
      this.camera.update(this.player.position);

      this.map.render();

      this.entityManager.update();

      //this.spawner.update(this.player.position);

      this.frames ++;

      if(Date.now() - this.timer > 1000) {
        this.timer += 1000;
        Profiler.FPS = this.frames;
        this.frames = 0;
      }

      this.profiler.update();

      this.eventDispatcher.publish(Event.UPDATE, this.delta);

      this.lastTime = this.currentTime - (this.delta % this.interval);

      context.restore();
    }

    window.requestAnimationFrame(this.update.bind(this));
  }
}