import { Camera } from './Camera';
import { Node } from '@entity/Node';
import { Vector } from '@math/Vector';
import { Types } from '@entity/Entity';

export class Map {

  public nodes:Node[][];
  public nodeSize:number;
  public width:number = 0;
  public height:number = 0;
  public path:Node[] = [];

  private static instance:Map;

  public static getInstance(width?:number, height?:number, nodeSize:number=32) {
    if(!Map.instance) {
      Map.instance = new Map(width, height, nodeSize);
    }
    return Map.instance;
  }

  public constructor(width?:number, height?:number, nodeSize:number=32) {
    this.width = width;
    this.height = height;
    this.nodes = [];
    this.nodeSize = nodeSize;
  }

  public generate(map?:number[][]):void {
    if(map === undefined) {
      var rows = ~~(this.width / this.nodeSize) + 1;
      var columns = ~~(this.height / this.nodeSize) + 1;
      
      for (var x = 0, i = 0; i < rows; x += this.nodeSize, i++) {
        this.nodes[i] = [];
        for (var y = 0, j = 0; j < columns; y += this.nodeSize, j++) {
          this.nodes[i][j] = new Node(i, j, this.nodeSize, Math.round(Math.random()));
        }
      }
    } else {
      this.width = map.length * this.nodeSize;
      this.height = map[0].length * this.nodeSize;
      for (var x = 0, i = 0; i < map.length; x+= this.nodeSize, i++) {
        this.nodes[i] = [];
        for (var y = 0, j = 0; j < map[i].length; y += this.nodeSize, j++) {
          this.nodes[i][j] = new Node(i, j, this.nodeSize, map[i][j]);
        }
      }
    }
  }

  public render():void {
    for(let i = 0; i < this.nodes.length; i ++) {
      for(let j = 0; j < this.nodes[i].length; j ++) {
        let node:Node = this.nodes[i][j];
        if(Camera.inViewPort(node.position.x, node.position.y)) {
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

  public getNeighborsByPoint(source:Vector, distance:number = 0):Node[] {
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
        var node:Node = this.nodeFromIndex(Math.floor(i), Math.floor(j));
        neighbors.push(node);
      }
    }
    return neighbors;
  }

  public getNeighborsByNode(node:Node):Node[] {
    var neighbors:Node[] = [];
    for(var x = -1; x <= 1; x ++) {
      for(var y = -1; y <= 1; y ++) {
        if(x == 0 && y == 0) {
          continue;
        }

        var cx = node.gridX + x;
        var cy = node.gridY + y;
        
        neighbors.push(this.nodeFromIndex(cx, cy));
      }
    }
    return neighbors;
  }

  public nodeFromWorldPoints(points:Vector[]):Node[] {
    var nodes:Node[] = [];
    for(var i = 0; i < points.length; i ++) {
      var point:Vector = points[i];
      var node:Node = this.nodeFromWorldPoint(point);
      if(node !== undefined && node.type !== Types.Collider) {
        nodes.push(node);
        nodes = Map.removeDuplicateNodes(nodes);
      }
    }
    return nodes;
  }

  public nodeFromWorldPoint(point:Vector):Node {
    var x = Math.floor(point.x / this.nodeSize);
    var y = Math.floor(point.y / this.nodeSize);
    return this.nodeFromIndex(x, y);
  }

  public nodeFromIndex(x:number, y:number):Node {
    if (x < 0 && x > this.width && y < 0 && y > this.height) return;
    return this.nodes[x][y];
  }

  public static removeDuplicateNodes(arr:Node[]) {
    return arr.filter((e, i) => {
      return arr.findIndex((x) => {
      return x.position.x == e.position.x && x.position.y == e.position.y;}) == i;
    });
  }
}