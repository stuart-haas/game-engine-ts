import { Vector } from '@math/Vector';

export enum Types{
  Path = 0,
  Collider = 1
}

export class Entity {

  public neighbors: Entity[] = [];
  public position: Vector;
  public velocity: Vector;
  public acceleration: Vector;
  public maxForce: number;
  public maxSpeed: number;
  public mass: number;
  public friction: number;
  public size: number;
  public color: string;
  public type: number;

  constructor(position?: Vector, maxForce?: number, maxSpeed?: number, mass?: number, friction?: number, size?: number, color?: string) {
    this.position = position || new Vector();
    this.velocity = new Vector();
    this.acceleration = new Vector();
    this.maxForce = maxForce || .25;
    this.maxSpeed = maxSpeed || 1;
    this.mass = mass || 100;
    this.friction = friction || .95
    this.size = size || 16;
    this.color = color || '#000';
  }

  public update(target?: Vector): void {
    this.velocity.add(this.acceleration);
    this.velocity.multiply(this.friction);
    this.acceleration.divide(this.mass);
    this.position.add(this.velocity);
  }

  public render(): void {};
}