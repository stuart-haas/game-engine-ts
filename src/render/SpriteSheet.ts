import { Entity } from '@entity/Entity';
import { context } from '@core/Canvas';

export class SpriteSheet {

  public parent: Entity;
  public frameWidth: number;
  public frameHeight: number;
  public framesPerRow: number;
  public image: HTMLImageElement;

  constructor(parent: Entity, path: string, frameWidth: number, frameHeight: number) {
      this.parent = parent;
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;

      this.image = new Image();
      this.image.onload = this.loadImage.bind(this);
      this.image.src = path;
  }

  loadImage(): void {
      this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
  }

  render(): void {
    context.drawImage(
          this.image,
          this.parent.position.x, this.parent.position.y,
          this.frameWidth, this.frameHeight);
  }
}