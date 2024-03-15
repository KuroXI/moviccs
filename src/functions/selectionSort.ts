export const selectionSort = <T>(arr: T[], key: keyof T, desc = true): T[] => {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (desc ? arr[j]![key] > arr[min]![key] : arr[j]![key] < arr[min]![key]) {
        min = j;
      }
    }

    const tmp = arr[min]!;
    arr[min] = arr[i]!;
    arr[i] = tmp;
  }

  return arr;
};
