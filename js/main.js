(function() {
    var tl = new TimelineLite();

    function generarFraccion() {
        var valMin = 2;
        var valMax = 10;

        var denominador = Math.floor(Math.random() * (valMax - valMin)) + valMin;
        var numerador = denominador;

        while (numerador >= denominador) {
            numerador = Math.floor(Math.random() * (denominador - valMin - 1)) + valMin;
        }

        return [numerador, denominador];
    }

    // Esta función devuelve el máximo común divisor entre 2 números x é y
    function mcd(x, y) {
        var resto = 0;

        while (x % y != 0) {
            resto = x % y;
            x = y;
            y = resto;
        }
        return y;
    }

    function accionRegenFr() {
        var numerador = document.getElementById('numerador');
        var denominador = document.getElementById('denominador');
        var fraccion = [];
        var divisor = 0;

        fraccionActual = [+numerador.innerText, +denominador.innerText];

        do {
            fraccion = generarFraccion();
            divisor = mcd(fraccion[0], fraccion[1]);
            fraccion = [fraccion[0] / divisor, fraccion[1] / divisor];

        } while (fraccionActual == fraccion);

        numerador.innerText = fraccion[0];
        denominador.innerText = fraccion[1];
    }

    function stopSonidos() {
        var sonidos = document.getElementsByTagName('audio');
        for (var i = 0; i < sonidos.length; i++) {
            sonidos[i].pause();
            sonidos[i].currentTime = 0.0;
        }
    }

    /**
     * Opción 0: Añadir divisiones en el rectángulo  (aumenta denominador de la fracción representada)
     * Opción 1: Añadir divisiones en el rectángulo  (aumenta denominador de la fracción representada)
     * Opción 2: Rellena de color (aumenta numerador de la fracción representada)
     * Opción 3: Quita color (disminuye numerador de la fracción representada)
     */
    function accionRectangulo(opcion) {
        var tl = new TimelineMax();
        var row = document.getElementsByClassName('divTableRow')[0];
        var cells = document.getElementsByClassName('divTableCell');
        var coloredCells = document.getElementsByClassName('colored');
        var sonidoError = document.getElementById('sonidoError');

        switch (opcion) {
            case 0:
                if (cells.length < 10) {
                    var cell = document.createElement('div');
                    var sonidoAddDenominador = document.getElementById('sonidoAddDenominador');
                    sonidoAddDenominador.play();

                    cell.setAttribute('class', 'divTableCell');
                    row.appendChild(cell);
                } else {
                    sonidoError.play();
                    Swal(
                        '¡Error!',
                        'No se pueden generar más de 10 divisiones',
                        'error'
                    );
                }
                break;
            case 1:
                if (cells.length > 2) {
                    var sonidoDelDenominador = document.getElementById('sonidoDelDenominador');
                    sonidoDelDenominador.play();
                    row.removeChild(cells[cells.length - 1]);
                } else {
                    sonidoError.play();
                    Swal(
                        '¡Error!',
                        'Sólo hay ' + cells.length + ' divisiones y es posible seguir quitando',
                        'error'
                    );
                }
                break;
            case 2:
                if (cells.length < 10 && coloredCells.length < cells.length - 1) {
                    for (var i = 0; i < cells.length; i++) {
                        if (cells[i].innerHTML.trim().length == 0) {
                            var colored = document.createElement('div');
                            var sonidoAddColor = document.getElementById('sonidoAddColor');
                            sonidoAddColor.play();

                            colored.setAttribute('class', 'colored');
                            cells[i].appendChild(colored);

                            tl.to(colored, 1.2, { width: "100%" });

                            i = cells.length; // Para salirnos del for
                        }
                    }
                } else {
                    sonidoError.play();
                    Swal(
                        '¡Error!',
                        'No se pueden colorear más celdas',
                        'error'
                    );
                }
                break;
                // Por construir    
            case 3:
                if (coloredCells.length > 0) {
                    var sonidoDelColor = document.getElementById('sonidoDelColor');
                    sonidoDelColor.play();
                    cells[coloredCells.length - 1].removeChild(coloredCells[coloredCells.length - 1]);
                } else {
                    sonidoError.play();
                    Swal(
                        '¡Error!',
                        'No hay más partes coloreadas que eliminar',
                        'error'
                    );
                }
                break;
        }
    }

    function validar() {
        var numerador = document.getElementById('numerador');
        var denominador = document.getElementById('denominador');
        var cells = document.getElementsByClassName('divTableCell');
        var coloredCells = document.getElementsByClassName('colored');

        var divisor = mcd(coloredCells.length, cells.length);

        var fraccionGen = [+numerador.innerText.trim(), +denominador.innerText.trim()];
        var fraccionEnv = [coloredCells.length / divisor, cells.length / divisor];

        if (fraccionGen[0] == fraccionEnv[0] && fraccionGen[1] == fraccionEnv[1]) {
            resCorrecta();
        } else {
            resIncorrecto();
        }
    }

    function resCorrecta() {
        var tabla = document.getElementById('tabla');
        var coloredCells = document.getElementsByClassName('colored');
        var sonidoCorrecto = document.getElementById('sonidoCorrecto');

        sonidoCorrecto.play();

        for (var i = 0; i < coloredCells.length; i++) {
            tl.to(coloredCells[i], 0.2, { backgroundColor: 'green' });
        }

        tl.to(tabla, 3, { ease: Power3.easeOut, marginLeft: '0', marginRight: '0', width: '100%', height: '200px', })
            .to(tabla, 3, { ease: Power3.easeOut, marginLeft: '8.75%', width: '80%', height: '100px' });

        for (i = coloredCells.length - 1; i >= 0; i--) {
            tl.to(coloredCells[i], 0.2, { backgroundColor: '#1F5DB5' });
        }
    }

    function resIncorrecto() {
        var tabla = document.getElementById('tabla');
        var coloredCells = document.getElementsByClassName('colored');
        var sonidoIncorrecto = document.getElementById('sonidoIncorrecto');

        sonidoIncorrecto.play();

        for (var i = 0; i < coloredCells.length; i++) {
            coloredCells[i].style.visibility = 'hidden';
        }

        tl.to(tabla, 0.2, { marginLeft: '0', marginRight: '17.5%', backgroundColor: 'red' })
            .to(tabla, 0.2, { marginLeft: '17.5%', marginRight: '0' })
            .to(tabla, 0.2, { marginLeft: '0', marginRight: '17.5%' })
            .to(tabla, 0.2, { marginLeft: '8.75%', marginRight: '8.75%', backgroundColor: 'inherit' });

        for (i = 0; i < coloredCells.length; i++) {
            tl.to(coloredCells[i], 0.2, { visibility: 'visible' });
        }
    }

    function init() {
        var btnRegenerar = document.getElementById('btn-regenerar');
        var btnAddDenominador = document.getElementById('btn-add-denominador');
        var btnDelDenominador = document.getElementById('btn-del-denominador');
        var btnAddColor = document.getElementById('btn-add-color');
        var btnDelColor = document.getElementById('btn-del-color');
        var btnValidar = document.getElementById('btn-validar');

        accionRegenFr();
        btnRegenerar.addEventListener('click', function() {
            stopSonidos();
            accionRegenFr();
        });
        btnAddDenominador.addEventListener('click', function() {
            stopSonidos();
            accionRectangulo(0);
        });
        btnDelDenominador.addEventListener('click', function() {
            stopSonidos();
            accionRectangulo(1);
        });
        btnAddColor.addEventListener('click', function() {
            stopSonidos();
            accionRectangulo(2);
        });
        btnDelColor.addEventListener('click', function() {
            stopSonidos();
            accionRectangulo(3);
        });
        btnValidar.addEventListener('click', function() {
            stopSonidos();
            validar();
        });

    }

    init();

})();