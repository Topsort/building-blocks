import { DocumentStyleProperty, Rgb, Style } from "@types";

export const isRgbValid = (rgb: Rgb) => {
  const rgbArray = Array.isArray(rgb)
    ? rgb
    : rgb.split(",").map((value) => parseInt(value, 10));

  return (
    rgbArray.length === 3 &&
    rgbArray.every(
      (value) => typeof value === "number" && value >= 0 && value <= 255
    )
  );
};

const invalidRgbWarningTypes: Record<
  DocumentStyleProperty,
  [string, keyof Style]
> = {
  "--ts-primary-rgb": ["primary", "primaryColorRgb"],
  "--ts-secondary-rgb": ["secondary", "secondaryColorRgb"],
  "--ts-font-rgb": ["font", "fontColorRgb"],
};

export const getInvalidRgbWarning = (
  propertyName: DocumentStyleProperty,
  value: unknown
) => {
  const [colorName, colorVariable] = invalidRgbWarningTypes[propertyName];
  return (
    `Unable to set custom ${colorName} color. Was ${colorVariable} provided in the correct format?` +
    "\n\n" +
    `Provided: ${JSON.stringify(value)}` +
    "\n\n" +
    "It must either formatted as:" +
    "\n\n" +
    '  "50, 175, 200"' +
    "\n\n" +
    "or" +
    "\n\n" +
    "  [50, 175, 200]" +
    "\n\n" +
    "And the values must be between 0 and 255."
  );
};

export const setDocumentStyleProperty = (
  propertyName: DocumentStyleProperty,
  rgb: Rgb
) => {
  document.documentElement.style.setProperty(
    propertyName,
    Array.isArray(rgb) ? rgb.join(", ") : rgb
  );
};
