export class Heap<T extends IHeapItem<T>> {

  items:T[];
  currentItemCount:number;

  public constructor() {
    this.items = [];
    this.currentItemCount = 0;
  }

  public push(item:T):void {
    item.heapIndex = this.currentItemCount;
    this.items[this.currentItemCount] = item;
    this.sortUp(item);
    this.currentItemCount++;
  }

  public removeFirst():T {
    var firstItem:T = this.items[0];
    this.currentItemCount--;
    this.items[0] = this.items[this.currentItemCount];
    this.items[0].heapIndex = 0;
    this.sortDown(this.items[0]);
    return firstItem;
  }

  public update(item:T):void {
    this.sortUp(item);
  }

  public get length():number {
    return this.currentItemCount;
  }

  public includes(item:T):boolean {
    return this.items[item.heapIndex] == item;
  }

  public sortDown(item:T):void {
    while(true) {
      var childIndexLeft:number = item.heapIndex * 2 + 1;
      var childIndexRight:number = item.heapIndex * 2 + 2;
      var swapIndex:number = 0;

      if(childIndexLeft < this.currentItemCount) {
        swapIndex = childIndexLeft;

        if(childIndexRight < this.currentItemCount) {
          if(this.items[childIndexLeft].compareTo(this.items[childIndexRight]) < 0) {
            swapIndex = childIndexRight;
          }
        }

        if(item.compareTo(this.items[swapIndex]) < 0) {
          this.swap(item, this.items[swapIndex])
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }

  public sortUp(item:T):void {
    var parentIndex = Math.floor((item.heapIndex - 1) / 2);

    while(parentIndex > 0) {
      var parentItem = this.items[parentIndex];
      if(item.compareTo(parentItem) > 0) {
        this.swap(item, parentItem);
      } else {
        break;
      }
      parentIndex = Math.floor((item.heapIndex - 1) / 2);
    }
  }

  private swap(itemA:T,itemB:T):void {
    this.items[itemA.heapIndex] = itemB;
    this.items[itemB.heapIndex] = itemA;
    var itemAIndex = itemA.heapIndex;
    itemA.heapIndex = itemB.heapIndex;
    itemB.heapIndex = itemAIndex;
  }
}

export interface IHeapItem<T> {
  heapIndex:number;
  compareTo(other:T):number;
}