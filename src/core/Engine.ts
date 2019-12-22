import { context, Canvas } from "./Canvas";
import { Player } from '@entity/Player';
import { Spawner } from './Spawner';
import { Map } from './Map';
import { Camera } from './Camera';
import { EntityManager } from './EntityManager';

export class Engine {

  public canvas: HTMLCanvasElement;
  public map: Map;
  public camera: Camera;
  public player: Player;
  public entityManager: EntityManager;
  public spawner: Spawner;

  public constructor() {

    this.map = new Map(5000, 5000);
    this.camera = new Camera();
    this.player = new Player();
    this.entityManager = new EntityManager();
    this.spawner = new Spawner(this.entityManager);
  }

  public start(): void {

    this.canvas = Canvas.initialize();

    Canvas.WIDTH = this.canvas.width;
    Canvas.HEIGHT = this.canvas.height;

    this.loop();
  }

  public loop(): void {
    const self = this;

    this.camera.update(context, this.player.position, function() {
      self.map.generate(context);

      self.player.update();
      self.player.render(context);

      self.spawner.update(self.player.position);

      self.entityManager.update(self.player.position, context);      
    });

    requestAnimationFrame(this.loop.bind(this));
  }

  public resize(): void {
    if(this.canvas !== undefined) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.outerHeight;
    }
  }
}