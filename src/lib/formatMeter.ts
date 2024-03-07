export const formatMeter = (value: number, decimalPlaces = 2): string => {
  const absValue = Math.abs(value);

  // Determine the unit based on the value
  let unit = 'm';
  let formattedValue = absValue.toFixed(decimalPlaces);

  if (absValue >= 1000) {
    formattedValue = (absValue / 1000).toFixed(decimalPlaces);
    unit = 'km';
  } else if (absValue < 1) {
    formattedValue = (absValue * 100).toFixed(decimalPlaces);
    unit = 'cm';
  }

  return `${value < 0 ? "-" : ""}${formattedValue} ${unit}`;
}