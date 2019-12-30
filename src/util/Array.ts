export class Array {
  public static compare(a:number, b:number):number {
    if(a < b) return -1;
    if(a == b) return 0;
    if(a > b) return 1;
  }
}