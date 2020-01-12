import { Vector } from '@math/Vector';
import { AStar } from './AStar';
import { LayerId } from '@core/Map';

export interface PathRequestCallback {
  ( path:Vector[], success:boolean ) : void;
}

export class PathManager {

  public static instance:PathManager;

  public static createInstance() {
    if(!PathManager.instance) {
      PathManager.instance = new PathManager();
    }
    return PathManager.instance;
  }

  private pathRequestQueue:PathRequest[] = [];
  private currentPathRequest:PathRequest;

  private isProcessingPath:boolean;

  public static requestPath(pathStart:Vector, pathEnd:Vector, callback:PathRequestCallback):void {
    var pathRequest:PathRequest = new PathRequest(pathStart, pathEnd, callback);
    this.instance.pathRequestQueue.push(pathRequest);
    this.instance.tryProcessNext();
  }

  private tryProcessNext():void {
    if(!this.isProcessingPath && this.pathRequestQueue.length > 0) {
      this.currentPathRequest = this.pathRequestQueue.shift();
      this.isProcessingPath = true;
      AStar.search(this.currentPathRequest.pathStart, this.currentPathRequest.pathEnd, LayerId.Collision);
    }
  }

  public static finishedProcessingPath(path:Vector[], success:boolean):void {
    this.instance.currentPathRequest.callback(path, success);
    this.instance.isProcessingPath = false; 
    this.instance.tryProcessNext();
  }
}

export class PathRequest {

  public pathStart:Vector;
  public pathEnd:Vector;
  public callback:PathRequestCallback;

  public constructor(pathStart:Vector, pathEnd:Vector, callback:PathRequestCallback) {
    this.pathStart = pathStart;
    this.pathEnd = pathEnd;
    this.callback = callback;
  }
}