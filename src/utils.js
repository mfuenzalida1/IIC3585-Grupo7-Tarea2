// import css
require('./style.css');
import { TEXT_COLOR, TEXT_FONT } from './constants';

// Se crea el canvas y el contexto usado para dibujar elementos:
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Seteo de dimensiones del canvas:
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/*
const input = document.createElement('input');
input.setAttribute('class', 'user-input');
input.setAttribute('placeholder', 'RESULT');
input.setAttribute('type', 'number');
*/

// Crear boton para jugar de nuevo
const button = document.createElement('button');
button.setAttribute('class', 'hidden');
button.innerHTML = 'REPLAY';

// Agrega el canvas y el boton al html
document.body.appendChild(canvas);
document.body.appendChild(button);

// Dibuja el puntaje del P1
function showP1Score(score) {
    context.fillStyle = TEXT_COLOR;
    context.font = TEXT_FONT;
    context.fillText(`P1 SCORE: ${score}`, 40, 43);
}

// Dibuja el puntaje del P2
function showP2Score(score) {
    context.fillStyle = TEXT_COLOR;
    context.font = TEXT_FONT;
    context.fillText(`P2 SCORE: ${score}`, canvas.width - 300, 43);
}

// Saca todos los elementos del mapa
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Dibuja al jugador 1
function showP1({ x, y, angle }) {
    const image = new Image();
    image.src = "../images/player1.jpg"
    context.beginPath();
    context.translate(x, y);
    context.rotate(angle * (Math.PI / 180));
    context.drawImage(image, -40 / 2, 70 / 2, 40, -70);
    context.rotate(-angle * (Math.PI / 180));
    context.translate(-x, -y);
}

// Dibuja al jugador 2
function showP2({ x, y, angle }) {
    const image = new Image();
    image.src = "../images/player2.png"
    context.beginPath();
    context.translate(x, y);
    context.rotate(angle * (Math.PI / 180));
    context.drawImage(image, -40 / 2, 70 / 2, 40, -70);
    context.rotate(-angle * (Math.PI / 180));
    context.translate(-x, -y);
}

// Dibuja los obstaculos en el mapa
function showObstacles(obstacles) {
    const startAngle = 0 * (Math.PI / 180);
    const endAngle = 360 * (Math.PI / 180);

    context.strokeStyle = '#af111c';
    context.fillStyle = '#ff522b';
    context.lineWidth = 2;
    obstacles.forEach(({ x, y, radius }) => {
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle, false);
        context.fill();
        context.stroke();
    });
}

// Crea un obstaculo en el mapa:
function createObstacle() {
    return {
        x: fetchRandomValue(canvas.width),
        y: 0,
        radius: parseInt((Math.random() * 10) + 5)
    };
}

// Esconder boton para jugar de nuevo
function hideButton() {
    button.setAttribute('class', 'hidden');
}

// Mostrar boton para jugar de nuevo
function showButton() {
    button.setAttribute('class', 'button');
}

// Offset de colisiones
const offset = 50;

// Detecta colisiones entre un obstaculo y un jugador
function detectCollision(obstacles, player) {
    return obstacles.some(obstacle => isCollision(obstacle, player))
}

// Revisa los rangos de colisiones
function isCollision(obstacle, player) {
    return (obstacle.x > player.x - offset && obstacle.x < player.x + offset) && (obstacle.y > player.y - offset && obstacle.y < player.y + offset)
}

// Retorna un numero al azar en un rango
function fetchRandomValue(range) {
    return parseInt(Math.random() * range);
}

function getAngleChange(angle, upMove, downMove, leftMove, rightMove) {
    if (upMove && leftMove && (angle % 360 != 315)) {
        if ((angle % 360 <= 45) || (angle % 360 >= 315)) {
            return -5;
        } else if ((angle % 360 <= 315) && (angle % 360 >= 225)) {
            return 5;
        } else {
            return 180;
        }
    } else if (upMove && rightMove && (angle % 360 != 45)) {
        if ((angle % 360 <= 135) && (angle % 360 >= 45)) {
            return -5;
        } else if ((angle % 360 <= 45) || (angle % 360 >= 315)) {
            return 5;
        } else {
            return 180;
        }
    } else if (downMove && leftMove && (angle % 360 != 225)) {
        if ((angle % 360 <= 315) && (angle % 360 >= 225)) {
            return -5;
        } else if ((angle % 360 <= 225) && (angle % 360 >= 135)) {
            return 5;
        } else {
            return 180;
        }
    } else if (downMove && rightMove && (angle % 360 != 135)) {
        if ((angle % 360 <= 225) && (angle % 360 >= 135)) {
            return -5;
        } else if ((angle % 360 <= 135) && (angle % 360 >= 45)) {
            return 5;
        } else {
            return 180;
        }
    } else if (upMove && !rightMove && !leftMove && (angle % 360 != 0)) {
        if ((angle % 360 <= 90) && (angle % 360 >= 0)) {
            return -5;
        } else if (((angle % 360 < 360) && (angle % 360 >= 270)) || (angle % 360 == 0)) {
            return 5;
        } else {
            return 180;
        }
    } else if (downMove && !rightMove && !leftMove && (angle % 360 != 180)) {
        if ((angle % 360 <= 270) && (angle % 360 >= 180)) {
            return -5;
        } else if ((angle % 360 <= 180) && (angle % 360 >= 90)) {
            return 5;
        } else {
            return 180;
        }
    } else if (leftMove && !upMove && !downMove && (angle % 360 != 270)) {
        if (((angle % 360 < 360) && (angle % 360 >= 270)) || (angle % 360 == 0)) {
            return -5;
        } else if ((angle % 360 <= 270) && (angle % 360 >= 180)) {
            return 5;
        } else {
            return 180;
        }
    } else if (rightMove && !upMove && !downMove && (angle % 360 != 90)) {
        if ((angle % 360 <= 180) && (angle % 360 >= 90)) {
            return -5;
        } else if ((angle % 360 <= 90) && (angle % 360 >= 0)) {
            return 5;
        } else {
            return 180;
        }
    }
    return 0
}

module.exports = {
    canvas,
    button,
    showP1Score,
    showP2Score,
    clearCanvas,
    showP1,
    showP2,
    showObstacles,
    createObstacle,
    detectCollision,
    showButton,
    hideButton,
    getAngleChange
}