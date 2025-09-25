export default function isDarkOverlayReadable(colorString) {
  if (!colorString || typeof colorString !== 'string') return false;
  
  let r;
  let g;
  let b;

  if (colorString.match(/^rgb/)) {
    const colorValues = colorString.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
    );
    [r, g, b] = colorValues.slice(1);
  } else {
    const hexString = colorString
      .slice(1)
      .replace(colorString.length < 5 ? /./g : '', '$&$&');
    const hexToRgb = parseInt(hexString, 16);
    // eslint-disable-next-line no-bitwise
    r = (hexToRgb >> 16) & 255;
    // eslint-disable-next-line no-bitwise
    g = (hexToRgb >> 8) & 255;
    // eslint-disable-next-line no-bitwise
    b = hexToRgb & 255;
  }

  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp > 140;
}
