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
function showP1({ x, y }) {
    context.beginPath();
    context.rect(x, y, 60, -120);
    // Color de llenado
    context.fillStyle = "red";
    context.fill();
    context.stroke();
}

// Dibuja al jugador 2
function showP2({ x, y }) {
    context.beginPath();
    context.rect(x, y, 60, -120);
    // Color de llenado
    context.fillStyle = "blue";
    context.fill();
    context.stroke();

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
    hideButton
}