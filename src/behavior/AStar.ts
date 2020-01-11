import { Vector } from '@math/Vector';
import { Graph } from 'map/Graph';
import { Node } from '@entity/Node';
import { Heap } from '@util/Heap';
import { LayerId } from '@map/Graph';
import { LayerIndex } from '@map/Graph';
import { context } from '../core/Canvas';
import { Shape } from '@draw/Shape';

export class AStar {

  private graph:Graph;

  constructor() {
    this.graph = Graph.getInstance();
  }

  public search(start:Vector, target:Vector, layer:LayerId):Vector[] {
    var open:Heap<Node> = new Heap<Node>();
    var closed:Node[] = [];

    var startNode:Node = this.graph.nodeFromWorldPoint(start, layer);
    var targetNode:Node = this.graph.nodeFromWorldPoint(target, layer);

    open.push(startNode);

    while(open.length > 0) {
      var currentNode:Node = open.removeFirst();
      closed.push(currentNode);

      if(currentNode == targetNode) {
        return this.trace(startNode, targetNode);
      }

      var neighbors = this.graph.getNeighborsByNode(currentNode, layer);
      for(var j = 0; j < neighbors.length; j++) {
        var neighbor:Node = neighbors[j];
        if(neighbor !== undefined) {
          if(neighbor.index >= LayerIndex[layer] || closed.includes(neighbor)) {
            continue;
          }

          var costToNeighbor:number = currentNode.gCost + this.heuristic(currentNode, neighbor);
          if(costToNeighbor < neighbor.gCost || !open.includes(neighbor)) {
            neighbor.gCost = costToNeighbor;
            neighbor.hCost = this.heuristic(neighbor, targetNode);
            neighbor.parent = currentNode;

            if(!open.includes(neighbor)) {
              open.push(neighbor);
            }
          }
        }
      }
    }
  }

  private trace(startNode:Node, targetNode:Node):Vector[] {
    var path:Node[] = [];
    var currentNode:Node = targetNode;

    while(currentNode !== startNode) {
      path.push(currentNode);
      currentNode = currentNode.parent;
    }

    var waypoints:Vector[] = this.waypoints(path);
    waypoints = waypoints.reverse();

    return waypoints;
  }

  private waypoints(path:Node[]):Vector[] {
    var waypoints:Vector[] = [];
    var directionOld:Vector = new Vector();

    for(let i = 0; i < path.length; i ++) {
      if(path[i] !== undefined && path[i - 1] !== undefined) {
        var directionNew:Vector = new Vector(path[i - 1].gx - path[i].gx, path[i - 1].gy - path[i].gy);
        if(!directionNew.equals(directionOld)) {
          waypoints.push(path[i].position);
        }
        directionOld = directionNew;
      }
    }
    return waypoints;
  }

  private heuristic(nodeA:Node, nodeB:Node):number {
    var dx:number = Math.abs(nodeA.position.x - nodeB.position.x);
    var dy:number = Math.abs(nodeA.position.y - nodeB.position.y);
    if(dx > dy) 
      return 14 * dy + 10 * (dx - dy);
    return 14 * dx + 10 * (dy - dx);
  }
}