// Get DOM elements
const displayButton = document.getElementById("displayButton");
const generateButton = document.getElementById("generateButton");
const inputNumber = document.getElementById("inputNumber");
const barcode = document.getElementById("ean-13");
const validationMessage = document.getElementById("validationMessage");
const successMessage = document.getElementById("successMessage");
const saveButtonSVG = document.getElementById("saveButtonSVG");
const saveButtonJPEG = document.getElementById("saveButtonJPEG");

// Initially disable the display button
displayButton.disabled = true;

// Add event listener to input field
inputNumber.addEventListener("input", validateInput);

// Add event listener to display button
displayButton.addEventListener("click", (event) => {
  event.preventDefault();
  generateBarcode();
});

// Add event listener to generate button
generateButton.addEventListener("click", (event) => {
  event.preventDefault();
  generateRandomBarcode();
});

// Add an event listener to the save button svg
saveButtonSVG.addEventListener("click", saveAsSVG);

// Add an event listener to the save button jpeg
saveButtonJPEG.addEventListener("click", saveAsJPEG);

// Validate input
function validateInput() {
  const isValid = isValidInput(inputNumber.value);

  displayButton.disabled = !isValid;
  validationMessage.textContent = !isValid
    ? "Please enter a 12-digit number."
    : "";
  successMessage.textContent = "";

  if(inputNumber.value == '092309010206') {
    console.log("hola");
    successMessage.textContent = "Descubriste el código secreto!. Jessy. Te quiero <3";
  }

}

// Generate barcode
function generateBarcode() {
  const inputValue = inputNumber.value;
  if (isValidInput(inputValue)) {
    const ean13Number = calculateEAN13(inputValue);
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
function generateRandomBarcode() {
  const randomNumber = generateRandomNumber(12);
  inputNumber.value = randomNumber;
  const ean13Number = calculateEAN13(randomNumber);
  JsBarcode(barcode, ean13Number, { format: "ean13" });
  saveButtonSVG.disabled = false;
  saveButtonJPEG.disabled = false;
  validationMessage.textContent = "";
  successMessage.textContent =
    "Great! Your random barcode was generated successfully.";
}

// Validate input
function isValidInput(input) {
  return input.length === 12 && !isNaN(input);
}

// Generate random number
function generateRandomNumber(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

// Calculate EAN-13 number
function calculateEAN13(first12Digits) {
  let checkDigit = 0;
  for (let i = 0; i < 12; i++) {
    checkDigit += (i % 2 === 0 ? 1 : 3) * first12Digits[i];
  }
  checkDigit = (10 - (checkDigit % 10)) % 10;

  return `${first12Digits}${checkDigit}`;
}

function saveAsSVG() {
  // Create a new XMLSerializer
  const serializer = new XMLSerializer();

  // Serialize the SVG element to a string
  const svgStr = serializer.serializeToString(barcode);

  // Convert the SVG string to a data URL
  const dataUrl = "data:image/svg+xml;base64," + btoa(svgStr);

  // Create a new anchor element
  const downloadLink = document.createElement("a");

  // Set the href of the anchor element to the data URL
  downloadLink.href = dataUrl;

  // Set the download attribute of the anchor element to specify the filename
  downloadLink.download = "barcode.svg";

  // Trigger a click event on the anchor element
  downloadLink.click();
}

function saveAsJPEG() {
  // Create a new XMLSerializer
  const serializer = new XMLSerializer();

  // Serialize the SVG element to a string
  const svgStr = serializer.serializeToString(barcode);

  // Convert the SVG string to a data URL
  const dataUrl = "data:image/svg+xml;base64," + btoa(svgStr);

  // Create a new Image element
  const img = new Image();
  img.src = dataUrl;

  img.onload = function () {
    // Create a new canvas element
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Get the 2D context of the canvas
    const ctx = canvas.getContext("2d");

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Convert the canvas to a JPEG
    const jpegDataUrl = canvas.toDataURL("image/jpeg");

    // Create a new anchor element
    const downloadLink = document.createElement("a");

    // Set the href of the anchor element to the JPEG data URL
    downloadLink.href = jpegDataUrl;

    // Set the download attribute of the anchor element to specify the filename
    downloadLink.download = "barcode.jpeg";

    // Trigger a click event on the anchor element
    downloadLink.click();
  };
}
