export const selectionSort = <T>(arr: T[], keyOrCompareFn: keyof T | ((a: T, b: T) => number), desc = true): T[] => {
  const compareValues = (a: T, b: T): number => {
    if (typeof keyOrCompareFn === "function") {
      return desc ? keyOrCompareFn(b, a) : keyOrCompareFn(a, b);
    } else {
      return desc
        ? (b[keyOrCompareFn] as never) - (a[keyOrCompareFn] as never)
        : (a[keyOrCompareFn] as never) - (b[keyOrCompareFn] as never);
    }
  };

  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (compareValues(arr[j]!, arr[min]!) < 0) {
        min = j;
      }
    }

    const tmp = arr[min]!;
    arr[min] = arr[i]!;
    arr[i] = tmp;
  }

  return arr;
};
