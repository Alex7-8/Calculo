google.charts.load('current', {'packages':['corechart']});

function calcularTeoremaValorMedio() {
    var a = parseFloat(document.getElementById("extremo-a").value);
    var b = parseFloat(document.getElementById("extremo-b").value);

    var funcion = function(x) {
        return Math.pow(x, 2); // Actualizamos la función a f(x) = x^2
    };

    if (!isNaN(a) && !isNaN(b) && a < b) {
        var valorMedio = (funcion(b) - funcion(a)) / (b - a);
        generarGrafica(a, b, funcion);
        document.getElementById("resultado").innerHTML = "El resultado del Teorema del Valor Medio es: " + valorMedio.toFixed(2);
    } else {
        alert("Ingresa valores numéricos válidos para los extremos a y b, y asegúrate de que a sea menor que b.");
    }
}

function generarGrafica(a, b, funcion) {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    data.addColumn('number', 'f(x)');

    var paso = 0.1;

    for (var x = a; x <= b; x += paso) {
        data.addRow([x, funcion(x)]);
    }

    var options = {
        title: 'Gráfica de f(x)',
        curveType: 'function',
        width: 600,
        height: 400
    };

    var chart = new google.visualization.LineChart(document.getElementById('grafica'));
    chart.draw(data, options);
}

google.charts.setOnLoadCallback(calcularTeoremaValorMedio);
