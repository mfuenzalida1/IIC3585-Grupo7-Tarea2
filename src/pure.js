// Funciones puras


const sumLatest = (prev, curr) => prev + curr;

// Jugador 1 se mueve con "a", "d", "w" y "s"
const directionP1x = key => key === 'a' || key === 'd';
const movementP1x = (prev, key, speed) => prev + (key === 'a' ? -4 / 10 * speed : 4 / 10 * speed);
const directionP1y = key => key === 'w' || key === 's';
const movementP1y = (prev, key, speed) => prev + (key === 'w' ? -4 / 10 * speed : 4 / 10 * speed);

// Jugador 2 se mueve con las felchas
const directionP2x = key => key === 'ArrowLeft' || key === 'ArrowRight';
const movementP2x = (prev, key, speed) => prev + (key === 'ArrowLeft' ? -4 / 10 * speed : 4 / 10 * speed);
const directionP2y = key => key === 'ArrowUp' || key === 'ArrowDown';
const movementP2y = (prev, key, speed) => prev + (key === 'ArrowUp' ? -4 / 10 * speed : 4 / 10 * speed);

const isDead = state => state;

module.exports = {
    sumLatest,
    directionP1x,
    movementP1x,
    directionP1y,
    movementP1y,
    directionP2x,
    movementP2x,
    directionP2y,
    movementP2y,
    isDead
};