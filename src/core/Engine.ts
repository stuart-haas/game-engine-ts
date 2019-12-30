import { context, Canvas } from "./Canvas";
import { Player } from '@entity/Player';
import { Spawner } from './Spawner';
import { Map } from './Map';
import { Camera } from './Camera';
import { EntityManager } from './EntityManager';
import { Collision } from '@physics/Collision';
import { ONE } from './Level';
import { Entity } from '@entity/Entity';
import { AStar } from '@behavior/AStar';
import { Vector } from "@math/Vector";

export class Engine {

  public canvas:HTMLCanvasElement;
  public map:Map;
  public camera:Camera;
  public player:Entity;
  public entityManager:EntityManager;
  public spawner:Spawner;

  private currentTime:number = 0;
  private lastTime:number = (new Date()).getTime();
  private delta:number = 0;
  private fps:number = 60;
  private interval:number = 1000 / this.fps;

  private aStar: AStar;

  public constructor() {
    this.map = Map.getInstance();
    this.camera = Camera.getInstance();
    this.entityManager = EntityManager.getInstance();
    this.spawner = Spawner.getInstance();

    this.entityManager.addEntity(new Player());
    this.player = this.entityManager.getEntity(0);

    this.aStar = new AStar();
  }

  public start():void {

    this.canvas = Canvas.initialize();

    Canvas.WIDTH = this.canvas.width;
    Canvas.HEIGHT = this.canvas.height;

    this.map.generate(ONE);

    this.loop();
  }

  public loop():void {

    window.requestAnimationFrame(this.loop.bind(this));

    this.currentTime = (new Date()).getTime();
    this.delta = (this.currentTime - this.lastTime);

    if(this.delta > this.interval) {
      
      context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
      context.save();
      
      this.camera.update(this.player.position);

      this.map.render();

      Collision.detect(this.player, 0, function(source:Entity, target:Entity) {
        target.color = 'green';
        Collision.resolve(source, target);
      });
      
      //this.spawner.update(this.player.position);

      this.entityManager.update();

      this.aStar.search(this.player.position, new Vector(250, 500));

      this.lastTime = this.currentTime - (this.delta % this.interval);

      context.restore();
    }
  }

  public resize():void {
    if(this.canvas !== undefined) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.outerHeight;
    }
  }
}