import { Types } from '@entity/Entity';
import { Vector } from '@math/Vector';
import { Map } from '@core/Map';
import { Node } from '@entity/Node';

export class AStar {

  private map:Map;

  constructor() {
    this.map = Map.getInstance();
  }

  public update(start:Vector, target:Vector):void {
    this.findPath(start, target);
  }

  public findPath(start:Vector, target:Vector):void {
    var open:Node[] = [];
    var closed:Node[] = [];

    var startNode:Node = this.map.nodeFromWorldPoint(start);
    var targetNode:Node = this.map.nodeFromWorldPoint(target);

    var index = open.push(startNode) - 1;

    while(open.length > 0) {
      var currentNode:Node = open[0];
      for(var i = 1; i < open.length; i++) {
        if(open[i].fCost < currentNode.fCost || 
          open[i].fCost == currentNode.fCost &&
          open[i].hCost < currentNode.hCost) {
          currentNode = open[i];
        }
      }

      open.splice(index, 1);
      closed.push(currentNode);

      if(currentNode == targetNode) {
        this.retracePath(startNode, targetNode);
        return;
      }

      var neighbors = this.map.getNeighborsByNode(currentNode);
      for(var j = 0; j < neighbors.length; j++) {
        var neighbor:Node = neighbors[j];
        if(neighbor.type !== Types.Path || closed.includes(neighbor)) {
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

  public retracePath(startNode:Node, targetNode:Node):void {
    var path:Node[] = [];
    var currentNode:Node = targetNode;

    while(currentNode !== startNode) {
      path.push(currentNode);
      currentNode = currentNode.parent;
    }

    path = path.reverse();

    this.map.path = path;
  }

  public heuristic(nodeA:Node, nodeB:Node):number {
    var dx:number = Math.abs(nodeA.position.x - nodeB.position.x);
    var dy:number = Math.abs(nodeA.position.y - nodeB.position.y);
    if(dx > dy) 
      return 14 * dy + 10 * (dx - dy);
    return 14 * dx + 10 * (dy - dx);
  }
}