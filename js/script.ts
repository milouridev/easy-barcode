// Get DOM elements
const displayButton: HTMLButtonElement = document.getElementById("displayButton") as HTMLButtonElement;
const generateButton: HTMLButtonElement = document.getElementById("generateButton") as HTMLButtonElement;
const inputNumber: HTMLInputElement = document.getElementById("inputNumber") as HTMLInputElement;
const barcode: SVGSVGElement = document.getElementById("ean-13") as SVGSVGElement;
const validationMessage: HTMLElement = document.getElementById("validationMessage") as HTMLElement;
const successMessage: HTMLElement = document.getElementById("successMessage") as HTMLElement;
const saveButtonSVG: HTMLButtonElement = document.getElementById("saveButtonSVG") as HTMLButtonElement;
const saveButtonJPEG: HTMLButtonElement = document.getElementById("saveButtonJPEG") as HTMLButtonElement;

// Initially disable the display button
displayButton.disabled = true;

// Add event listener to input field
inputNumber.addEventListener("input", validateInput);

// Add event listener to display button
displayButton.addEventListener("click", (event: Event) => {
  event.preventDefault();
  generateBarcode();
});

// Add event listener to generate button
generateButton.addEventListener("click", (event: Event) => {
  event.preventDefault();
  generateRandomBarcode();
});

// Add an event listener to the save button svg
saveButtonSVG.addEventListener("click", saveAsSVG);

// Add an event listener to the save button jpeg
saveButtonJPEG.addEventListener("click", saveAsJPEG);

// Validate input
function validateInput(): void {
  const isValid: boolean = isValidInput(inputNumber.value);

  displayButton.disabled = !isValid;
  validationMessage.textContent = !isValid
    ? "Please enter a 12-digit number."
    : "";
  successMessage.textContent = "";
}

// Generate barcode
function generateBarcode(): void {
  const inputValue: string = inputNumber.value;
  if (isValidInput(inputValue)) {
    const ean13Number: string = calculateEAN13(inputValue);
    JsBarcode(barcode, ean13Number, { format: "ean13" });
    saveButtonSVG.disabled = false;
    saveButtonJPEG.disabled = false;
    successMessage.textContent =
      "Great! Your barcode was generated successfully.";
  } else {
    alert("Oops! Please enter a 12-digit number.");
  }
}

// Generate random barcode
function generateRandomBarcode(): void {
  const randomNumber: string = generateRandomNumber(12);
  inputNumber.value = randomNumber;
  const ean13Number: string = calculateEAN13(randomNumber);
  JsBarcode(barcode, ean13Number, { format: "ean13" });
  saveButtonSVG.disabled = false;
  saveButtonJPEG.disabled = false;
  validationMessage.textContent = "";
  successMessage.textContent =
    "Great! Your random barcode was generated successfully.";
}

// Validate input
function isValidInput(input: string): boolean {
  return input.length === 12 && !isNaN(Number(input));
}

// Generate random number
function generateRandomNumber(length: number): string {
  let result: string = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

// Calculate EAN-13 number
function calculateEAN13(first12Digits: string): string {
  let checkDigit: number = 0;
  for (let i = 0; i < 12; i++) {
    checkDigit += (i % 2 === 0 ? 1 : 3) * Number(first12Digits[i]);
  }
  checkDigit = (10 - (checkDigit % 10)) % 10;

  return `${first12Digits}${checkDigit}`;
}

function saveAsSVG(): void {
  // Create a new XMLSerializer
  const serializer: XMLSerializer = new XMLSerializer();

  // Serialize the SVG element to a string
  const svgStr: string = serializer.serializeToString(barcode);

  // Convert the SVG string to a data URL
  const dataUrl: string = "data:image/svg+xml;base64," + btoa(svgStr);

  // Create a new anchor element
  const downloadLink: HTMLAnchorElement = document.createElement("a");

  // Set the href of the anchor element to the data URL
  downloadLink.href = dataUrl;

  // Set the download attribute of the anchor element to specify the filename
  downloadLink.download = "barcode.svg";

  // Trigger a click event on the anchor element
  downloadLink.click();
}

function saveAsJPEG(): void {
  // Create a new XMLSerializer
  const serializer: XMLSerializer = new XMLSerializer();

  // Serialize the SVG element to a string
  const svgStr: string = serializer.serializeToString(barcode);

  // Convert the SVG string to a data URL
  const dataUrl: string = "data:image/svg+xml;base64," + btoa(svgStr);

  // Create a new Image element
  const img: HTMLImageElement = new Image();
  img.src = dataUrl;

  img.onload = function (): void {
    // Create a new canvas element
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Get the 2D context of the canvas
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    // Draw the image onto the canvas
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }

    // Convert the canvas to a JPEG
    const jpegDataUrl: string = canvas.toDataURL("image/jpeg");

    // Create a new anchor element
    const downloadLink: HTMLAnchorElement = document.createElement("a");

    // Set the href of the anchor element to the JPEG data URL
    downloadLink.href = jpegDataUrl;

    // Set the download attribute of the anchor element to specify the filename
    downloadLink.download = "barcode.jpeg";

    // Trigger a click event on the anchor element
    downloadLink.click();
  };
}