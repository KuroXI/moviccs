export const selectionSort = <T>(arr: T[], compareFn: (a: T, b: T) => number): T[] => {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (compareFn(arr[j]!, arr[min]!) < 0) {
        min = j;
      }
    }
    
    const tmp = arr[min]!;
    arr[min] = arr[i]!;
    arr[i] = tmp;
  }

  return arr;
};
