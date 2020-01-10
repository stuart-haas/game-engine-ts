import { context, Canvas } from "./Canvas";
import { Player } from '@entity/Player';
import { Spawner } from './Spawner';
import { Graph, Layer } from '@map/Graph';
import { Camera } from './Camera';
import { EntityManager } from './EntityManager';
import { Entity } from '@entity/Entity';
import { AStar } from '@behavior/AStar';

export class Engine {

  public canvas:HTMLCanvasElement;
  public graph:Graph;
  public camera:Camera;
  public player:Entity;
  public entityManager:EntityManager;
  public spawner:Spawner;

  private currentTime:number = 0;
  private lastTime:number = (new Date()).getTime();
  private delta:number = 0;
  private fps:number = 60;
  private interval:number = 1000 / this.fps;

  public constructor() {
    this.graph = Graph.getInstance();
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

    this.graph.load("resources/tilemaps/Tilemap_Path Layer.csv", () => {
      this.graph.addNodes(this.graph.getMap(), "/resources/tilesets/tallgras.png", Layer.Path);
    });

    this.graph.load("resources/tilemaps/Tilemap_Collision Layer.csv", () => {
      this.graph.addNodes(this.graph.getMap(), "/resources/tilesets/fence.png", Layer.Collision);
    });

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

      this.graph.render();
      
      //this.spawner.update(this.player.position);

      this.entityManager.update();

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