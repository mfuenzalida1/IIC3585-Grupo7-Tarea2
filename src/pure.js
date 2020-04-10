// Funciones puras


const sumLatest = (prev, curr) => prev + curr;
// Jugador 1 se mueve con "a" y "d"
const directionP1 = key => key === 'a' || key === 'd';
// Jugador 2 se mueve con "<- y ->"
const directionP2 = key => key === 'ArrowLeft' || key === 'ArrowRight';
const movementP1 = (prev, key) => prev + (key === 'a' ? -10 : 10);
const movementP2 = (prev, key) => prev + (key === 'ArrowLeft' ? -10 : 10);
const isDead = state => state;

module.exports = {
    sumLatest,
    directionP1,
    directionP2,
    movementP1,
    movementP2,
    isDead
};