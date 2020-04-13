import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { canvas, button } from './utils';
import { showP1Score, showP2Score, clearCanvas, showP1, showP2, showObstacles, createObstacle, detectCollision, showButton, hideButton, getAngleChange, showWinner } from './utils';
import { directionP1x, movementP1x, directionP1y, movementP1y, directionP2x, movementP2x, directionP2y, movementP2y, sumLatest, isDead } from './pure';
import { SCORE_INTERVAL_RAISE, SCORE_INTERVAL_POINTS, OBSTACLE_FREQUENCY, OBSTACLE_DROP_SPEED } from './constants';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { scan } from 'rxjs/operator/scan';

// Ganador:
let winner = null;

// Tamaño de la pantalla:
const PLAYER_Y_POSITION = canvas.height - 70;

// Posicion inicial de jugadores:
const PLAYER1_STARTING_POSITION = canvas.width / 2 - 500;
const PLAYER2_STARTING_POSITION = canvas.width / 2 + 500;

// Observables:
const ScoreBehaviorP1$ = new BehaviorSubject(0);
const ScoreBehaviorP2$ = new BehaviorSubject(0);
const IsAliveP1$ = new BehaviorSubject(true);
const IsAliveP2$ = new BehaviorSubject(true);
const CurrentScoreP1$ = ScoreBehaviorP1$.scan(sumLatest);
const CurrentScoreP2$ = ScoreBehaviorP2$.scan(sumLatest);

// Emite un puntaje para los jugadores cada cierto intervalo:
const ScoreIntervalP1$ = Observable.interval(SCORE_INTERVAL_RAISE).map(() => SCORE_INTERVAL_POINTS);
const ScoreIntervalP2$ = Observable.interval(SCORE_INTERVAL_RAISE).map(() => SCORE_INTERVAL_POINTS);

const obstacleCreator$ = Observable.interval(OBSTACLE_FREQUENCY).map(x => {
    if (x % 20 === 0) {
        return createObstacle();
    }
    return null;
});

const Obstacles$ = obstacleCreator$
    .scan((obstacles, obstacle) => [...obstacles, obstacle].filter(obstacle => obstacle && obstacle.y <= canvas.height), [])
    .map(obstacles => {
        obstacles.forEach(obstacle => {
            obstacle.y += OBSTACLE_DROP_SPEED;
        });
        return obstacles;
    }).share();

const keydownSource = fromEvent(document, 'keydown');
const keyupSource = fromEvent(document, 'keyup');

const PlayerMovementP1x$ = new Observable(subscriber => {
    let movement = PLAYER1_STARTING_POSITION;
    let canMove = false;
    let keyPressed;
    let isPressingLeft = false;
    let isPressingRight = false;
    let speed = 0;
    let stop = false;
    keydownSource.pluck('key')
        .filter(directionP1x)
        .subscribe(key => {
            if ((isPressingLeft && (key == 'd')) || (isPressingRight && (key == 'a'))) {
                canMove = false;
                keyPressed = key;
                if (keyPressed == 'a') {
                    isPressingLeft = true;
                } else {
                    isPressingRight = true;
                }
            } else if (!isPressingLeft && !isPressingRight) {
                canMove = true;
                keyPressed = key;
                if (keyPressed == 'a') {
                    isPressingLeft = true;
                } else {
                    isPressingRight = true;
                }
            }
        });

    keyupSource.pluck('key')
        .filter(directionP1x)
        .subscribe(key => {
            if (isPressingLeft && isPressingRight) {
                if (key == 'a') {
                    keyPressed = 'd';
                    isPressingLeft = false;
                    isPressingRight = true;
                } else {
                    keyPressed = 'a';
                    isPressingLeft = true;
                    isPressingRight = false;
                }
                canMove = true;
            } else {
                canMove = false;
                if (keyPressed == 'a') {
                    isPressingLeft = false;
                } else {
                    isPressingRight = false;
                }
            }
        });

    Observable.interval(1).subscribe(val => {
        if (canMove || stop) {
            movement = movementP1x(movement, keyPressed, speed);
            subscriber.next(movement);
        } else {
            subscriber.next(movement);
        }
    });

    Observable.interval(50).subscribe(val => {
        if (speed < 10 && canMove) {
            speed++;
        }
    });

    Observable.interval(30).subscribe(val => {
        if (speed > 0 && !canMove) {
            speed--;
            stop = true;
        } else {
            stop = false;
        }
    });


});

const PlayerMovementP2x$ = new Observable(subscriber => {
    let movement = PLAYER2_STARTING_POSITION;
    let canMove = false;
    let keyPressed;
    let isPressingLeft = false;
    let isPressingRight = false;
    let speed = 0;
    let stop = false;
    keydownSource.pluck('key')
        .filter(directionP2x)
        .subscribe(key => {
            if ((isPressingLeft && (key == 'ArrowRight')) || (isPressingRight && (key == 'ArrowLeft'))) {
                canMove = false;
                keyPressed = key;
                if (keyPressed == 'ArrowLeft') {
                    isPressingLeft = true;
                } else {
                    isPressingRight = true;
                }
            } else if (!isPressingLeft && !isPressingRight) {
                canMove = true;
                keyPressed = key;
                if (keyPressed == 'ArrowLeft') {
                    isPressingLeft = true;
                } else {
                    isPressingRight = true;
                }
            }
        });

    keyupSource.pluck('key')
        .filter(directionP2x)
        .subscribe(key => {
            if (isPressingLeft && isPressingRight) {
                if (key == 'ArrowLeft') {
                    keyPressed = 'ArrowRight';
                    isPressingLeft = false;
                    isPressingRight = true;
                } else {
                    keyPressed = 'ArrowLeft';
                    isPressingLeft = true;
                    isPressingRight = false;
                }
                canMove = true;
            } else {
                canMove = false;
                if (keyPressed == 'ArrowLeft') {
                    isPressingLeft = false;
                } else {
                    isPressingRight = false;
                }
            }
        });

    Observable.interval(1).subscribe(val => {
        if (canMove || stop) {
            movement = movementP2x(movement, keyPressed, speed);
            subscriber.next(movement);
        } else {
            subscriber.next(movement);
        }
    });

    Observable.interval(50).subscribe(val => {
        if (speed < 10 && canMove) {
            speed++;
        }
    });

    Observable.interval(30).subscribe(val => {
        if (speed > 0 && !canMove) {
            speed--;
            stop = true;
        } else {
            stop = false;
        }
    });
});


const PlayerMovementP1y$ = new Observable(subscriber => {
    let movement = PLAYER_Y_POSITION;
    let canMove = false;
    let keyPressed;
    let isPressingUp = false;
    let isPressingDown = false;
    let speed = 0;
    let stop = false;
    keydownSource.pluck('key')
        .filter(directionP1y)
        .subscribe(key => {
            if ((isPressingUp && (key == 's')) || (isPressingDown && (key == 'w'))) {
                canMove = false;
                keyPressed = key;
                if (keyPressed == 'w') {
                    isPressingUp = true;
                } else {
                    isPressingDown = true;
                }
            } else if (!isPressingUp && !isPressingDown) {
                canMove = true;
                keyPressed = key;
                if (keyPressed == 'w') {
                    isPressingUp = true;
                } else {
                    isPressingDown = true;
                }
            }
        });

    keyupSource.pluck('key')
        .filter(directionP1y)
        .subscribe(key => {
            if (isPressingUp && isPressingDown) {
                if (key == 'w') {
                    keyPressed = 's';
                    isPressingUp = false;
                    isPressingDown = true;
                } else {
                    keyPressed = 'w';
                    isPressingUp = true;
                    isPressingDown = false;
                }
                canMove = true;
            } else {
                canMove = false;
                if (keyPressed == 'w') {
                    isPressingUp = false;
                } else {
                    isPressingDown = false;
                }
            }
        });

    Observable.interval(1).subscribe(val => {
        if (canMove || stop) {
            movement = movementP1y(movement, keyPressed, speed);
            subscriber.next(movement);
        } else {
            subscriber.next(movement);
        }
    });

    Observable.interval(50).subscribe(val => {
        if (speed < 10 && canMove) {
            speed++;
        }
    });

    Observable.interval(30).subscribe(val => {
        if (speed > 0 && !canMove) {
            speed--;
            stop = true;
        } else {
            stop = false;
        }
    });
});

const PlayerMovementP2y$ = new Observable(subscriber => {
    let movement = PLAYER_Y_POSITION;
    let canMove = false;
    let keyPressed;
    let isPressingUp = false;
    let isPressingDown = false;
    let speed = 0;
    let stop = false;
    keydownSource.pluck('key')
        .filter(directionP2y)
        .subscribe(key => {
            if ((isPressingUp && (key == 'ArrowDown')) || (isPressingDown && (key == 'ArrowUp'))) {
                canMove = false;
                keyPressed = key;
                if (keyPressed == 'ArrowUp') {
                    isPressingUp = true;
                } else {
                    isPressingDown = true;
                }
            } else if (!isPressingUp && !isPressingDown) {
                canMove = true;
                keyPressed = key;
                if (keyPressed == 'ArrowUp') {
                    isPressingUp = true;
                } else {
                    isPressingDown = true;
                }
            }
        });

    keyupSource.pluck('key')
        .filter(directionP2y)
        .subscribe(key => {
            if (isPressingUp && isPressingDown) {
                if (key == 'ArrowUp') {
                    keyPressed = 'ArrowDown';
                    isPressingUp = false;
                    isPressingDown = true;
                } else {
                    keyPressed = 'ArrowUp';
                    isPressingUp = true;
                    isPressingDown = false;
                }
                canMove = true;
            } else {
                canMove = false;
                if (keyPressed == 'ArrowUp') {
                    isPressingUp = false;
                } else {
                    isPressingDown = false;
                }
            }
        });

    Observable.interval(1).subscribe(val => {
        if (canMove || stop) {
            movement = movementP2y(movement, keyPressed, speed);
            subscriber.next(movement);
        } else {
            subscriber.next(movement);
        }
    });

    Observable.interval(50).subscribe(val => {
        if (speed < 10 && canMove) {
            speed++;
        }
    });

    Observable.interval(30).subscribe(val => {
        if (speed > 0 && !canMove) {
            speed--;
            stop = true;
        } else {
            stop = false;
        }
    });
});

const PlayerAngleP1$ = new Observable(subscriber => {
    let angle = 360 * 20;
    let upMove = false;
    let downMove = false;
    let leftMove = false;
    let rightMove = false;
    keydownSource.pluck('key')
        .subscribe(key => {
            if (key == 's') {
                downMove = true;
            } else if (key == 'w') {
                upMove = true;
            } else if (key == 'a') {
                leftMove = true;
            } else if (key == 'd') {
                rightMove = true;
            }
        });

    keyupSource.pluck('key')
        .subscribe(key => {
            if (key == 's') {
                downMove = false;
            } else if (key == 'w') {
                upMove = false;
            } else if (key == 'a') {
                leftMove = false;
            } else if (key == 'd') {
                rightMove = false;
            }
        });

    Observable.interval(1).subscribe(val => {
        subscriber.next(angle);
    });

    Observable.interval(3).subscribe(val => {
        angle += getAngleChange(angle, upMove, downMove, leftMove, rightMove);
    });
});

const PlayerAngleP2$ = new Observable(subscriber => {
    let angle = 360 * 20;
    let upMove = false;
    let downMove = false;
    let leftMove = false;
    let rightMove = false;
    keydownSource.pluck('key')
        .subscribe(key => {
            if (key == 'ArrowDown') {
                downMove = true;
            } else if (key == 'ArrowUp') {
                upMove = true;
            } else if (key == 'ArrowLeft') {
                leftMove = true;
            } else if (key == 'ArrowRight') {
                rightMove = true;
            }
        });

    keyupSource.pluck('key')
        .subscribe(key => {
            if (key == 'ArrowDown') {
                downMove = false;
            } else if (key == 'ArrowUp') {
                upMove = false;
            } else if (key == 'ArrowLeft') {
                leftMove = false;
            } else if (key == 'ArrowRight') {
                rightMove = false;
            }
        });

    Observable.interval(1).subscribe(val => {
        subscriber.next(angle);
    });

    Observable.interval(3).subscribe(val => {
        angle += getAngleChange(angle, upMove, downMove, leftMove, rightMove);
    });
});

const ScoreP1$ = Observable.merge(
    ScoreIntervalP1$
).takeWhile(isAliveP1);

const ScoreP2$ = Observable.merge(
    ScoreIntervalP2$
).takeWhile(isAliveP2);

const Life$ = Observable.combineLatest(
        Obstacles$,
        PlayerMovementP1x$,
        PlayerMovementP1y$,
        PlayerMovementP2x$,
        PlayerMovementP2y$
    ).map(([obstacles, p1x, p1y, p2x, p2y]) => {
        const collisionP1 = detectCollision(obstacles, p1x, p1y);
        const collisionP2 = detectCollision(obstacles, p2x, p2y);
        if (collisionP1 && !collisionP2) {
            winner = "P2";
            return true;
        } else if (!collisionP1 && collisionP2) {
            winner = "P1";
            return true;
        } else if (collisionP1 && collisionP2) {
            winner = "EMPATE";
            return true;
        }
        return false;
    })
    .filter(isDead)
    .takeWhile(isAliveP1 && isAliveP2);

const Game$ = Observable.combineLatest(
    CurrentScoreP1$, CurrentScoreP2$, PlayerMovementP1x$, PlayerMovementP1y$, PlayerAngleP1$, PlayerMovementP2x$, PlayerMovementP2y$, PlayerAngleP2$, Obstacles$,
    (scoreP1, scoreP2, p1x, p1y, ap1, p2x, p2y, ap2, obstacles) => ({ scoreP1, scoreP2, p1x, p1y, ap1, p2x, p2y, ap2, obstacles })
).sample(Observable.interval(1)).takeWhile(isAliveP1 && isAliveP2);

// Input click para el boton replay
Observable.fromEvent(button, 'click').subscribe(replay);

// Comenzar juego
startGame();

// Funcion que va creando y manejando los elementos:
function renderGame({ scoreP1, scoreP2, p1x, p1y, ap1, p2x, p2y, ap2, obstacles }) {
    clearCanvas();
    showP1Score(scoreP1);
    showP2Score(scoreP2);
    showP1({ x: p1x, y: p1y, angle: ap1 });
    showP2({ x: p2x, y: p2y, angle: ap2 });
    showObstacles(obstacles);
}

function clearObstacles() {
    console.log("clearing obstacles");
    Obstacles$.map(obstacle => {
        console.log(obstacle);
    });
}

function isAliveP1() {
    return IsAliveP1$.getValue();
}

function isAliveP2() {
    return IsAliveP2$.getValue();
}

function startGame() {
    Game$.subscribe(renderGame);
    ScoreP1$.subscribe(points => ScoreBehaviorP1$.next(points));
    ScoreP2$.subscribe(points => ScoreBehaviorP2$.next(points));
    Life$.subscribe(val => {
        IsAliveP1$.next(false);
        IsAliveP2$.next(false);
        showButton();
        showWinner(winner);
    });
}

function replay() {
    hideButton();
    IsAliveP1$.next(true);
    IsAliveP2$.next(true);
    startGame();
    CurrentScoreP1$.take(1).subscribe(lastValue => {
        ScoreBehaviorP1$.next(lastValue * -1);
    });
    CurrentScoreP2$.take(1).subscribe(lastValue => {
        ScoreBehaviorP2$.next(lastValue * -1);
    });
}