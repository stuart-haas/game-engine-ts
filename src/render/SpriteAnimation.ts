import { Entity } from '@entity/Entity';
import { SpriteSheet } from './SpriteSheet';
import { context } from '@core/Canvas';

export class SpriteAnimation {

  private parent: Entity;
  private spriteSheet: SpriteSheet;
  private frameSpeed: number;
  private startFrame: number;
  private endFrame: number;

  private animationSequence: number[] = [];
  private currentFrame: number = 0;
  private counter: number = 0;

  constructor(parent: Entity, spritesheet: SpriteSheet, frameSpeed: number, startFrame: number, endFrame: number) {
      this.parent = parent;
      this.spriteSheet = spritesheet;
      this.frameSpeed = frameSpeed;
      this.startFrame = startFrame;
      this.endFrame = endFrame;

      this.currentFrame = 0; 
      this.counter = 0; 

      for (var frameNumber = this.startFrame; frameNumber <= this.endFrame; frameNumber ++) {
        this.animationSequence.push(frameNumber);
      }
  }

  update() {
      if (this.counter == (this.frameSpeed - 1)) {
        this.currentFrame = (this.currentFrame + 1) % this.animationSequence.length;
      }

      this.counter = (this.counter + 1) % this.frameSpeed;
  }

  render() {
      var row = Math.floor(this.animationSequence[this.currentFrame] / this.spriteSheet.framesPerRow);
      var col = Math.floor(this.animationSequence[this.currentFrame] % this.spriteSheet.framesPerRow);
   
      context.drawImage(
        this.spriteSheet.image,
        col * this.spriteSheet.frameWidth, row * this.spriteSheet.frameHeight,
        this.spriteSheet.frameWidth, this.spriteSheet.frameHeight,
        this.parent.position.x, this.parent.position.y,
        this.spriteSheet.frameWidth, this.spriteSheet.frameHeight);
  }
}
