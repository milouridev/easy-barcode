// Get DOM elements
const displayButton = document.getElementById("displayButton");
const generateButton = document.getElementById("generateButton");
const inputNumber = document.getElementById("inputNumber");
const barcode = document.getElementById("ean-13");
const validationMessage = document.getElementById("validationMessage");
const successMessage = document.getElementById("successMessage");

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

// Validate input
function validateInput() {
  const isValid = isValidInput(inputNumber.value);

  displayButton.disabled = !isValid;
  validationMessage.textContent = !isValid
    ? "Please enter a 12-digit number."
    : "";
  successMessage.textContent = "";
}

// Generate barcode
function generateBarcode() {
  const inputValue = inputNumber.value;
  if (isValidInput(inputValue)) {
    const ean13Number = calculateEAN13(inputValue);
    JsBarcode(barcode, ean13Number, { format: "ean13" });
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
