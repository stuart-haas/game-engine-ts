export class Array {

  public static compare(a:number, b:number):number {
    if(a < b) return -1;
    if(a == b) return 0;
    if(a > b) return 1;
  }

  public static rotate(matrix:any[][]) {
    let result = [];
      for(let i = 0; i < matrix[0].length; i++) {
          let row = matrix.map(e => e[i]).reverse();
          result.push(row);
      }
      return result;
  }
}