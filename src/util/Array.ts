export class Array {

  public static rotate(arr:any[][]):any[][] {
    let result = [];
    for(let i = 0; i < arr[0].length; i++) {
        let row = arr.map(e => e[i]).reverse();
        result.push(row);
    }
    return Array.clean(result);
  }

  public static clean(arr:any[][]):any[][] {
    for(let i = 0; i < arr.length; i++) {
      for(let j = 0; j < arr[i].length; j++) {
          if(arr[i][j] == undefined || arr[i][j] == "") {
            arr[i].splice(j, 1);
          }
      }
    }
    return arr;
  }
}