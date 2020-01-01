import { Entity } from './Entity';
import { Vector } from '@math/Vector';
import { SpriteSheet } from '@render/SpriteSheet';
import { SpriteAnimation } from '@render/SpriteAnimation';

export class Coin extends Entity {

  private sprite:SpriteSheet;
  private animation:SpriteAnimation;

  constructor(position:Vector) {
    super(position);
    this.sprite = new SpriteSheet(this, "/resources/coin.png", 32, 32);
    this.animation = new SpriteAnimation(this, this.sprite, 3, 0, 7);
  }

  public update():void {
    this.animation.update();
  }

  public render():void {
    this.animation.render();
  }
}