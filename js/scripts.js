google.charts.load('current', {'packages':['corechart']});

function calculate() {
  const numeratorInput = document.getElementById("numerator-input").value;
  console.log(numeratorInput);
  const denominatorInput = document.getElementById("denominator-input").value;
  console.log(denominatorInput);
  const xValueInput = document.getElementById("x-value-input").value;
    console.log(xValueInput);   

  const numeratorFunc = new Function("x", "return " + parseExpression(numeratorInput));
  const denominatorFunc = new Function("x", "return " + parseExpression(denominatorInput));

  let xValue;
  let value, procedure;

  if (xValueInput.toLowerCase() !== "infinity") {
    xValue = parseFloat(xValueInput);

    const result = lHospital(numeratorFunc, denominatorFunc, xValue);
    value = result.value;
    procedure = result.procedure;

    drawChart(numeratorFunc, denominatorFunc, xValue);
  } else {
    xValue = "∞";
    value = "Indeterminado";
    procedure = "Lim x → " + xValue + "<br>";
  }

  const resultElement = document.getElementById("result");
  resultElement.innerHTML = `
    <h2>Resultado:</h2>
    <p>${value}</p>
    <h2>Procedimiento:</h2>
    <p>${procedure}</p>
  `;
}

function parseExpression(expression) {
  // Reemplazar las funciones matemáticas por las correspondientes en JavaScript
  expression = expression.replace(/sin/g, "Math.sin");
  expression = expression.replace(/cos/g, "Math.cos");
  expression = expression.replace(/tan/g, "Math.tan");
  expression = expression.replace(/sqrt/g, "Math.sqrt");
  expression = expression.replace(/log/g, "Math.log");
  expression = expression.replace(/π/g, "Math.PI");
  expression = expression.replace(/pi/g, "Math.PI");
  expression = expression.replace(/e/g, "Math.E");
  expression = expression.replace(/(\d+)([a-zA-Z])/g, "$1*$2");
 
  return expression;
}

function drawChart(numeratorFunc, denominatorFunc, xValue) {
  const data = new google.visualization.DataTable();
  data.addColumn('number', 'x');
  data.addColumn('number', 'Numerador');
  data.addColumn('number', 'Denominador');

  let startX, endX;
  if (xValue === Infinity) {
    startX = xValue - 10;
    endX = xValue;
  } else {
    startX = xValue - 5;
    endX = xValue + 5;
  }

  const step = 0.1;
  for (let x = startX; x <= endX; x += step) {
    const numeratorValue = numeratorFunc(x);
    const denominatorValue = denominatorFunc(x);
    data.addRow([x, numeratorValue, denominatorValue]);
  }

  const options = {
    title: 'Gráfico de la función',
    curveType: 'function',
    legend: { position: 'bottom' },
    width: 300,
    height: 200
  };

  const chart = new google.visualization.LineChart(document.getElementById('chart'));
  chart.draw(data, options);
}

function lHospital(numeratorFunc, denominatorFunc, x) {
  let value = numeratorFunc(x) / denominatorFunc(x);
  let procedure = `Lim x → ${x}<br>`;
  let iterations = 1;
  while (!isFinite(value) && iterations <= 10) {
    const numeratorDerivative = derivative(numeratorFunc, x);
    const denominatorDerivative = derivative(denominatorFunc, x);
    value = numeratorDerivative(x) / denominatorDerivative(x);
    procedure += `Iteración ${iterations}: ${numeratorDerivative(x)} / ${denominatorDerivative(x)} = ${value}<br>`;
    iterations++;
  }

  return {
    value: value,
    procedure: procedure
  };
}

function derivative(func, x) {
  const h = 0.0001;
  return function(x) {
    return (func(x + h) - func(x)) / h;
  };
}