// Funciones puras


const sumLatest = (prev, curr) => prev + curr;

// Jugador 1 se mueve con "a", "d", "w" y "s"
const directionP1x = key => key === 'a' || key === 'd';
const movementP1x = (prev, key) => prev + (key === 'a' ? -10 : 10);
const directionP1y = key => key === 'w' || key === 's';
const movementP1y = (prev, key) => prev + (key === 'w' ? -10 : 10);

// Jugador 2 se mueve con las felchas
const directionP2x = key => key === 'ArrowLeft' || key === 'ArrowRight';
const movementP2x = (prev, key) => prev + (key === 'ArrowLeft' ? -10 : 10);
const directionP2y = key => key === 'ArrowUp' || key === 'ArrowDown';
const movementP2y = (prev, key) => prev + (key === 'ArrowUp' ? -10 : 10);

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