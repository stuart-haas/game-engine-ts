import { Camera } from './Camera';
import { Node } from '@entity/Node';
import { Vector } from '@math/Vector';
import axios, { AxiosResponse } from 'axios';
import * as papaparse from 'papaparse';
import { Array } from '@util/Array';
import { SpriteSheet } from '@draw/SpriteSheet';

export enum LayerId {
  Player,
  Path = 1,
  Collision = 0
};

export var LayerIndex:number[] = [];

export class MapResource {

  public map:string;
  public spriteSheet:string;
  public layer:LayerId;

  public constructor(map:string, spriteSheet:string, layer:LayerId) {
    this.map = map;
    this.spriteSheet = spriteSheet;
    this.layer = layer;
  }
}

export class Map {

  private static instance:Map;

  public static getInstance(columns?:number, rows?:number, nodeSize:number=32) {
    if(!Map.instance) {
      Map.instance = new Map(columns, rows, nodeSize);
    }
    return Map.instance;
  }

  public nodeSize:number;
  public width:number;
  public height:number;
  public path:Node[] = [];

  private layers:Node[][][] = [];

  public constructor(columns?:number, rows?:number, nodeSize:number=32) {
    this.width = columns;
    this.height = rows;
    this.nodeSize = nodeSize;
  }

  public async load(objects:MapResource[]):Promise<AxiosResponse[]> {
    return await axios.all(objects.map(object => {
      return axios.get(object.map)
        .then(response => {
          var map:number[][] = papaparse.parse(response.data).data;
          map = Array.rotate(map);
          this.addNodes(map, object.spriteSheet, object.layer);
          return papaparse.parse(response.data).data;
        });   
    }));
  }

  public addNodes(map:number[][], imagePath:string, layer:LayerId):void {
    this.width = 0;
    this.height = 0;
    var nodes:Node[][] = [];
    var spriteSheet:SpriteSheet = new SpriteSheet();
    spriteSheet.load(imagePath, this.nodeSize, this.nodeSize);
    for(let x = 0; x < map.length; x ++) {
      nodes[x] = [];
      this.width = map.length * this.nodeSize;
      for(let y = 0; y < map[x].length; y ++) {
        nodes[x][y] = new Node(spriteSheet, map[x][y], x, y, this.nodeSize, layer);
        this.height = map[x].length * this.nodeSize;
      }
    }
    var index = this.layers.push(nodes) - 1;
    LayerIndex[layer] = index;
  }

  public render():void {
    for(var key in this.layers) {
      var nodes = this.layers[key];
      for(let i = 0; i < nodes.length; i ++) {
        for(let j = 0; j < nodes[i].length; j ++) {
          let node:Node = nodes[i][j];
          if(Camera.inViewPort(node.position.x, node.position.y)) {
            if(node.index > LayerId.Collision) {
              node.render();
            }
          }
        }
      }
    }
  }

  public getNeighborsByPoint(source:Vector, layer:LayerId, distance:number = 0):Node[] {
    var neighbors:Node[] = [];
    var left:number = source.x / this.nodeSize - distance;
    var right:number = (source.x + this.nodeSize) / this.nodeSize + distance;
    var top:number = source.y / this.nodeSize - distance;
    var bottom:number = (source.y + this.nodeSize) / this.nodeSize + distance;

    if(left < 0) left = 0;
    if(right > this.width) right = this.width;
    if(top < 0) top = 0;
    if(bottom > this.height) bottom = this.height;

    for(var i = left; i <= right; i ++) { 
      for(var j = top; j <= bottom; j ++) {
        var node:Node = this.nodeFromIndex(Math.floor(i), Math.floor(j), layer);
        neighbors.push(node);
      }
    }
    return neighbors;
  }

  public getNeighborsByNode(node:Node, layer:LayerId):Node[] {
    var neighbors:Node[] = [];
    for(let x = -1; x <= 1; x ++) {
      for(let y = -1; y <= 1; y ++) {
        if(x == 0 && y == 0) {
          continue;
        }

        var cx = node.gx + x;
        var cy = node.gy + y;
        
        neighbors.push(this.nodeFromIndex(cx, cy, layer));
      }
    }
    return neighbors;
  }

  public nodeFromWorldPoint(point:Vector, layer:LayerId):Node {
    let x = Math.floor(point.x / this.nodeSize);
    let y = Math.floor(point.y / this.nodeSize);
    return this.nodeFromIndex(x, y, layer);
  }

  public nodeFromIndex(x:number, y:number, layer:LayerId):Node {
    if (x <= 0 || x >= this.width / this.nodeSize || y <= 0 || y >= this.height / this.nodeSize) return;
    return this.layers[LayerIndex[layer]][x][y];
  }
}