import { Camera } from '../core/Camera';
import { Node } from '@entity/Node';
import { Vector } from '@math/Vector';
import axios, { AxiosResponse } from 'axios';
import { parse } from 'papaparse';
import { Array } from '@util/Array';
import { SpriteSheet } from '@draw/SpriteSheet';

export enum LayerId {
  Player,
  Path = 1,
  Collision = 0
};

export var LayerIndex:number[] = [];

export class Graph {

  public nodeSize:number;
  public width:number;
  public height:number;
  public path:Node[] = [];

  graph:number[][] = [];
  layers:Node[][][] =[];

  private static instance:Graph;

  public static getInstance(columns?:number, rows?:number, nodeSize:number=32) {
    if(!Graph.instance) {
      Graph.instance = new Graph(columns, rows, nodeSize);
    }
    return Graph.instance;
  }

  public constructor(columns?:number, rows?:number, nodeSize:number=32) {
    this.width = columns;
    this.height = rows;
    this.graph = [];
    this.nodeSize = nodeSize;
  }

  public load(path:string, callback:Function):void {
    axios.get(path).then((response:AxiosResponse) => {
      var data:string = response.data;
      this.graph = parse(data).data;
      this.graph = Array.rotate(this.graph);
      callback();
    })
  }


  public addNodes(graph:number[][], imagePath:string, layer:LayerId):void {
    var nodes:Node[][] = [];
    var spriteSheet:SpriteSheet = new SpriteSheet();
    spriteSheet.load(imagePath, this.nodeSize, this.nodeSize);
    for(var x = 0; x < graph.length; x ++) {
      nodes[x] = [];
      for(var y = 0; y < graph[x].length; y ++) {
        nodes[x][y] = new Node(spriteSheet, graph[x][y], x, y, this.nodeSize, layer);
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
            if(this.path !== null) {
              if(this.path.includes(node)) {
                node.render('black');
              }
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
    for(var x = -1; x <= 1; x ++) {
      for(var y = -1; y <= 1; y ++) {
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
    var x = Math.floor(point.x / this.nodeSize);
    var y = Math.floor(point.y / this.nodeSize);
    return this.nodeFromIndex(x, y, layer);
  }

  public nodeFromIndex(x:number, y:number, layer:LayerId):Node {
    if (x < 0 || x > this.width || y < 0 || y > this.height) return;
    return this.layers[LayerIndex[layer]][x][y];
  }

  public getMap():number[][] {
    return this.graph;
  }
}