import { Camera } from './Camera';
import { Tile } from './Tile';

export class Map {

  public static WIDTH:number = 0;
  public static HEIGHT:number = 0;

  public tiles: Tile[][];
  public tileSize:number;

  public constructor(width?: number, height?: number, tileSize:number=32) {
    Map.WIDTH = width;
    Map.HEIGHT = height;
    this.tiles = [];
    this.tileSize = tileSize;
  }

  public generate(map?: number[][]): void {
    if(map === undefined) {
      var rows = ~~(Map.WIDTH / this.tileSize) + 1;
      var columns = ~~(Map.HEIGHT / this.tileSize) + 1;
      
      for (var x = 0, i = 0; i < rows; x += this.tileSize, i++) {
        this.tiles[i] = [];
        for (var y = 0, j = 0; j < columns; y += this.tileSize, j++) {
          this.tiles[i][j] = new Tile(x, y, Math.round(Math.random()));
        }
      }
    } else {
      Map.WIDTH = map.length * this.tileSize;
      Map.HEIGHT = map[0].length * this.tileSize;
      for (var x = 0, i = 0; i < map.length; x+= this.tileSize, i++) {
        this.tiles[i] = [];
        for (var y = 0, j = 0; j < map[i].length; y += this.tileSize, j++) {
          this.tiles[i][j] = new Tile(x, y, map[i][j]);
        }
      }
    }
  }

  public render(context: CanvasRenderingContext2D): void {
    for(let i = 0; i < this.tiles.length; i ++) {
      for(let j = 0; j < this.tiles[i].length; j ++) {
        let tile:Tile = this.tiles[i][j];
        if(Camera.inViewPort(tile.position.x, tile.position.y)) {
          context.beginPath();
          context.rect(tile.position.x, tile.position.y, this.tileSize - 2, this.tileSize - 2);
          context.fillStyle = tile.color;
          context.fill();
          context.closePath();
        }
      }
    }
  }

  public tileAt(x: number, y: number): Tile {
    return this.tiles[x][y];
  }
}