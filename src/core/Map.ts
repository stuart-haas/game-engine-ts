import { Camera } from './Camera';
import { Tile } from '@entity/Tile';
import { Vector } from '@math/Vector';
import { Types, Entity } from '@entity/Entity';

export class Map {

  public tiles: Tile[][];
  public tileSize: number;
  public width: number = 0;
  public height: number = 0;

  private static instance: Map;

  public static getInstance(width?: number, height?: number, tileSize:number=32) {
    if(!Map.instance) {
      Map.instance = new Map(width, height, tileSize);
    }
    return Map.instance;
  }

  public constructor(width?: number, height?: number, tileSize:number=32) {
    this.width = width;
    this.height = height;
    this.tiles = [];
    this.tileSize = tileSize;
  }

  public generate(map?: number[][]): void {
    if(map === undefined) {
      var rows = ~~(this.width / this.tileSize) + 1;
      var columns = ~~(this.height / this.tileSize) + 1;
      
      for (var x = 0, i = 0; i < rows; x += this.tileSize, i++) {
        this.tiles[i] = [];
        for (var y = 0, j = 0; j < columns; y += this.tileSize, j++) {
          this.tiles[i][j] = new Tile(x, y, this.tileSize, Math.round(Math.random()));
        }
      }
    } else {
      this.width = map.length * this.tileSize;
      this.height = map[0].length * this.tileSize;
      for (var x = 0, i = 0; i < map.length; x+= this.tileSize, i++) {
        this.tiles[i] = [];
        for (var y = 0, j = 0; j < map[i].length; y += this.tileSize, j++) {
          this.tiles[i][j] = new Tile(x, y, this.tileSize, map[i][j]);
        }
      }
    }
  }

  public render(): void {
    for(let i = 0; i < this.tiles.length; i ++) {
      for(let j = 0; j < this.tiles[i].length; j ++) {
        let tile:Tile = this.tiles[i][j];
        if(Camera.inViewPort(tile.position.x, tile.position.y)) {
          tile.render();
        }
      }
    }
  }

  public renderNeighbors(points: Vector[], color:string = 'green'): Entity[] {
    var tiles:Entity[] = [];
    for(var i = 0; i < points.length; i ++) {
      var point:Vector = points[i];
      var tile: Tile = this.tileByVector(point.x, point.y);
      if(tile !== undefined && tile.type !== Types.Collider) {
        var newTile = new Tile(tile.position.x, tile.position.y, tile.size, tile.type);
        newTile.color = color;
        newTile.render();
        tiles.push(newTile);
        tiles = Map.removeDuplicateNeighbors(tiles);
      }
    }
    return tiles;
  }

  public static removeDuplicateNeighbors(arr: Entity[]) {
    return arr.filter((e, i) => {
      return arr.findIndex((x) => {
      return x.position.x == e.position.x && x.position.y == e.position.y;}) == i;
    });
  }

  public findNeighors(source: Vector, distance: number = 0): Entity[] {
    var neighbors:Entity[] = [];
    var left:number = source.x / this.tileSize - distance;
    var right:number = (source.x + this.tileSize) / this.tileSize + distance;
    var top:number = source.y / this.tileSize - distance;
    var bottom:number = (source.y + this.tileSize) / this.tileSize + distance;

    if(left < 0) left = 0;
    if(right > this.width) right = this.width;
    if(top < 0) top = 0;
    if(bottom > this.height) bottom = this.height;

    for(var i = left; i <= right; i ++) { 
      for(var j = top; j <= bottom; j ++) {
        var tile: Tile = this.tileByIndex(Math.floor(i), Math.floor(j));
        neighbors.push(tile);
      }
    }
    return neighbors;
  }

  public tileByVector(x: number, y: number): Tile {
    var _x = Math.floor(x / this.tileSize);
    var _y = Math.floor(y / this.tileSize);
    return this.tileByIndex(_x, _y);
  }

  public tileByIndex(x: number, y: number): Tile {
    if (x < 0 || x >= this.tiles.length || y < 0 || y >= this.tiles[0].length) return;
    return this.tiles[x][y];
  }
}