import { Camera } from '../core/Camera';
import { Node } from '@entity/Node';
import { Vector } from '@math/Vector';
import axios, { AxiosResponse } from 'axios';
import { parse } from 'papaparse';
import { Array } from '@util/Array';

export enum Layer {
  Player,
  Path = 4,
  Collision = 0
};

export class Graph {

  public nodes:Node[][];
  public nodeSize:number;
  public width:number;
  public height:number;
  public path:Node[] = [];

  map:number[][] = [];
  layers: { [key:number]:Node[][] } = {};

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
    this.nodes = [];
    this.map = [];
    this.nodeSize = nodeSize;
  }

  public load(path:string, callback:Function):void {
    axios.get(path).then((response:AxiosResponse) => {
      var data:string = response.data;
      this.map = parse(data).data;
      this.map = Array.rotate(this.map);
      callback();
    })
  }


  public addNodes(graph:number[][], texturePath:string, layer:Layer):void {
    var nodes:Node[][] = [];
    for(var x = 0; x < graph.length; x ++) {
      nodes[x] = [];
      for(var y = 0; y < graph[x].length; y ++) {
        nodes[x][y] = new Node(graph[x][y], x, y, this.nodeSize, layer);
        this.layers[layer] = nodes;
      }
    }
  }

  public render():void {
    for (let nodes of Object.values(this.layers)) {
      for(let i = 0; i < nodes.length; i ++) {
        for(let j = 0; j < nodes[i].length; j ++) {
          let node:Node = nodes[i][j];
          if(Camera.inViewPort(node.position.x, node.position.y)) {
            if(node.index > Layer.Collision) {
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

  public getNeighborsByPoint(source:Vector, layer:Layer, distance:number = 0):Node[] {
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

  public getNeighborsByNode(node:Node, layer:Layer):Node[] {
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

  public nodeFromWorldPoint(point:Vector, layer:Layer):Node {
    var x = Math.floor(point.x / this.nodeSize);
    var y = Math.floor(point.y / this.nodeSize);
    return this.nodeFromIndex(x, y, layer);
  }

  public nodeFromIndex(x:number, y:number, layer:Layer):Node {
    if (x < 0 || x > this.width || y < 0 || y > this.height) return;
    return this.layers[layer][x][y];
  }

  public getMap():number[][] {
    return this.map;
  }
}