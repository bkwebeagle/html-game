var body = document.getElementsByTagName('body')[0];
var bodyHeight = window.screen.height + 100;
var bodyWidth = window.screen.width + 100;
var userElement = document.getElementById('user');
var userTop = 500;
var userLeft = 600;

var moveVertical = 0;
var moveHorisontal = 0;

var renderInterfalSpeed = 30;
var fireInterfalSpeed = 180;

var renderIntr;
var fireIntr;

var ZAMEDLENIE = 1;

function start() {
    renderIntr = setInterval(render, renderInterfalSpeed);
    fireIntr = setInterval(fire, fireInterfalSpeed);
}

start();

var hasFire = false;
var fireColorClass = 'fire-color-1';
var fireSpeed = 50;
var mouseLeft = 0;
var mouseTop = 0;

var setFire = new Set();

var setUnits = new Set();

for (var x = 1; x <= 30; x++) {
    for (var y = 1; y <= 6; y++) {
        createUnit(40 * x, 40 * y);
    }
}

function createUnit(startLeft, startTop) {
    var unitElement = document.createElement('div');
    unitElement.classList.add('unit');
    unitElement.style.left = startLeft + 'px';
    unitElement.style.top = startTop + 'px';
    unitElement.setAttribute('data-left', startLeft);
    unitElement.setAttribute('data-top', startTop);
    body.appendChild(unitElement);

    setUnits.add(unitElement);
}

function hasDied(x1, y1, x2, y2, uX, uY, uR) {
    x1 -= uX;
    y1 -= uY;
    x2 -= uX;
    y2 -= uY;

    var dx = x2 - x1;
    var dy = y2 - y1;

    var a = dx * dx + dy * dy;
    var b = 2 * (x1 * dx + y1 * dy);
    var c = x1 * x1 + y1 * y1 - uR * uR;

    if (-b < 0) {
        return (c < 0);
    }

    if (-b < (2 * a)) {
        return ((4 * a * c - b * b) < 0);
    }

    return (a + b + c < 0);
}

function hasZamedlit(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var dt = Math.sqrt(dx * dx + dy * dy);
    var dr = r1 + r2;
    return dt < dr;
}

function render() {
    ZAMEDLENIE = 1;
    setUnits.forEach(function(unit) {
        var unitLeft = parseFloat(unit.getAttribute('data-left'));
        var unitTop = parseFloat(unit.getAttribute('data-top'));

        if (hasZamedlit(userLeft, userTop, 50, unitLeft, unitTop, 15)) {
            ZAMEDLENIE = 0.1;
        }
    });

    userTop += moveVertical * ZAMEDLENIE;
    userLeft += moveHorisontal * ZAMEDLENIE;

    userElement.style.top = userTop + 'px';
    userElement.style.left = userLeft + 'px';

    setFire.forEach(function(fire) {
        var leftOld = parseFloat(fire.getAttribute('data-left'));
        var moveLeft = parseFloat(fire.getAttribute('data-move-left'));
        var topOld = parseFloat(fire.getAttribute('data-top'));
        var moveTop = parseFloat(fire.getAttribute('data-move-top'));
        var left = leftOld + moveLeft;
        var top = topOld + moveTop;

        setUnits.forEach(function(unit) {
            // очищаем первичное состояние
            if (leftOld > 0 && topOld > 0) {
                var unitLeft = parseFloat(unit.getAttribute('data-left'));
                var unitTop = parseFloat(unit.getAttribute('data-top'));
                if (hasDied(leftOld, topOld, left, top, unitLeft, unitTop, 15)) {
                    setUnits.delete(unit);
                    unit.remove();
                    // unit.classList.add('unit-died');
                    setFire.delete(fire);
                    fire.remove();
                }
            }
        });

        if (left > 0 && left < bodyWidth && top > 0 && top < bodyHeight) {
            fire.setAttribute('data-left', left);
            fire.setAttribute('data-top', top);
            fire.style.left = left + 'px';
            fire.style.top = top + 'px';
        } else {
            setFire.delete(fire);
            fire.remove();
        }
    })

}

function fire() {
    if (hasFire) {

        var left = mouseLeft - userLeft;
        var top = mouseTop - userTop;

        var lenght = Math.sqrt(left * left + top * top);
        var moveFireLeft = (fireSpeed / lenght) * left;
        var moveFireTop = (fireSpeed / lenght) * top;


        var fireElement = document.createElement('div');
        fireElement.classList.add('fire');
        fireElement.classList.add(fireColorClass);
        fireElement.style.left = userLeft + 'px';
        fireElement.style.top = userTop + 'px';
        fireElement.setAttribute('data-left', userLeft);
        fireElement.setAttribute('data-top', userTop);
        fireElement.setAttribute('data-move-left', moveFireLeft);
        fireElement.setAttribute('data-move-top', moveFireTop);
        body.appendChild(fireElement);

        setFire.add(fireElement);
    }
}

document.addEventListener('mousedown', function(event) {
    hasFire = true;
});

document.addEventListener('mouseup', function(event) {
    hasFire = false;
});

document.addEventListener('mousemove', function(event) {
    mouseLeft = event.clientX;
    mouseTop = event.clientY;
});

document.addEventListener('keydown', function(event) {
    switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
            moveHorisontal = -10;
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveVertical = 10;
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveHorisontal = 10;
            break;
        case 'KeyW':
        case 'ArrowUp':
            moveVertical = -10;
            break;

        case 'Digit1':
            fireInterfalSpeed = 180;
            fireColorClass = 'fire-color-1';
            clearInterval(fireIntr);
            fireIntr = setInterval(fire, fireInterfalSpeed);
            break;

        case 'Digit2':
            fireInterfalSpeed = 120;
            fireColorClass = 'fire-color-2';
            clearInterval(fireIntr);
            fireIntr = setInterval(fire, fireInterfalSpeed);
            break;

        case 'Digit3':
            fireInterfalSpeed = 30;
            fireColorClass = 'fire-color-3';
            clearInterval(fireIntr);
            fireIntr = setInterval(fire, fireInterfalSpeed);
            break;
        default:
            console.log(event.code);
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
            moveHorisontal = 0;
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveVertical = 0;
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveHorisontal = 0;
            break;
        case 'KeyW':
        case 'ArrowUp':
            moveVertical = 0;
            break;
        default:
            console.log(event.code);
            break;
    }
});

document.getElementsByTagName('iframe').forEach(function(iframe) {
    iframe.remove();
});