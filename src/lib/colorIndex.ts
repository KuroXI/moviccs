const colors = ["red", "green", "blue", "yellow", "orange", "purple", "pink", "brown", "gray", "teal"];

export const getColorByIndex = (index: number): string => {
  return colors[(index + colors.length) % colors.length]!;
};
