
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let waitingForNumber = false;
let finished = false;

function updateDisplay() {
    
  if (operator && previous !== null) {
    const symbol = {
      "+": "+",
      "-": "−",
      "*": "×",
      "/": "÷"
    }[operator];

    display.value = waitingForNumber
      ? `${previous} ${symbol}`
      : `${previous} ${symbol} ${current}`;
  } else {
    display.value = current;
  }
}

function reset() {
  current = "0";
  previous = null;
  operator = null;
  waitingForNumber = false;
  finished = false;
  updateDisplay();
}

function inputNumber(number) {
  if (current === "Error" || finished) reset();

  if (waitingForNumber) {
    current = number;
    waitingForNumber = false;
  } else if (current === "0") {
    current = number;
  } else if (current.length < 14) {
    current += number;
  }

  updateDisplay();
}

function inputDecimal() {
  if (current === "Error" || finished) reset();

  if (waitingForNumber) {
    current = "0.";
    waitingForNumber = false;
  } else if (!current.includes(".")) {
    current += ".";
  }

  updateDisplay();
}

function calculate() {
  const a = Number(previous);
  const b = Number(current);
  let result;

  if (operator === "+") result = a + b;
  if (operator === "-") result = a - b;
  if (operator === "*") result = a * b;
  if (operator === "/") result = b === 0 ? NaN : a / b;

  if (!Number.isFinite(result)) {
    current = "Error";
  } else {
    current = String(Number(result.toPrecision(10)));
  }

  previous = null;
  operator = null;
  waitingForNumber = true;
  finished = true;
  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (current === "Error") reset();

  if (operator && !waitingForNumber) {
    calculate();
  }

  previous = current;
  operator = nextOperator;
  waitingForNumber = true;
  finished = false;
}

function deleteLast() {
  if (current === "Error" || finished) {
    reset();
    return;
  }

  if (!waitingForNumber) {
    current = current.length > 1
      ? current.slice(0, -1)
      : "0";

    if (current === "-") current = "0";
  }

  updateDisplay();
}

buttons.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "decimal") {
    inputDecimal();
  } else if (button.dataset.action === "clear") {
    reset();
  } else if (button.dataset.action === "delete") {
    deleteLast();
  } else if (button.dataset.action === "equals") {
    if (operator && !waitingForNumber) calculate();
  }
});

document.addEventListener("keydown", function (event) {
  if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
  else if (event.key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    if (operator && !waitingForNumber) calculate();
  } else if (event.key === "Escape") reset();
  else if (event.key === "Backspace") deleteLast();
});