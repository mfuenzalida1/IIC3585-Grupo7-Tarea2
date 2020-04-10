import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { canvas, button } from './utils';
import { showP1Score, showP2Score, clearCanvas, showP1, showP2, showObstacles, createObstacle, detectCollision, showButton, hideButton } from './utils';
import { directionP1, directionP2, movementP1, movementP2, sumLatest, isDead } from './pure';
import { SCORE_INTERVAL_RAISE, SCORE_INTERVAL_POINTS, OBSTACLE_FREQUENCY, OBSTACLE_DROP_SPEED } from './constants';

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

const obstacleCreator$ = Observable.interval(OBSTACLE_FREQUENCY).map(_ => createObstacle());

const Obstacles$ = obstacleCreator$
    .scan((obstacles, obstacle) => [...obstacles, obstacle].filter(obstacle => !(obstacle.y > canvas.height)), [])
    .map(obstacles => {
        obstacles.forEach(obstacle => {
            obstacle.y += OBSTACLE_DROP_SPEED;
        });
        return obstacles;
    }).share();

const PlayerMovementP1$ = Observable.fromEvent(document, 'keyup')
    .merge(Observable.fromEvent(document, 'keydown'))
    .pluck('key')
    .filter(directionP1)
    .scan(movementP1, PLAYER1_STARTING_POSITION)
    .startWith(PLAYER1_STARTING_POSITION)
    .filter(x => !(x > canvas.width - 50 || x < 50));

const PlayerMovementP2$ = Observable.fromEvent(document, 'keyup')
    .merge(Observable.fromEvent(document, 'keydown'))
    .pluck('key')
    .filter(directionP2)
    .scan(movementP2, PLAYER2_STARTING_POSITION)
    .startWith(PLAYER2_STARTING_POSITION)
    .filter(x => !(x > canvas.width - 50 || x < 50));

const ScoreP1$ = Observable.merge(
    ScoreIntervalP1$
).takeWhile(isAliveP1);

const ScoreP2$ = Observable.merge(
    ScoreIntervalP2$
).takeWhile(isAliveP2);

const LifeP1$ = Observable.combineLatest(
        Obstacles$,
        PlayerMovementP1$
    ).map(([obstacles, x]) => detectCollision(obstacles, { x, y: PLAYER_Y_POSITION }))
    .filter(isDead)
    .takeWhile(isAliveP1);

const LifeP2$ = Observable.combineLatest(
        Obstacles$,
        PlayerMovementP2$
    ).map(([obstacles, x]) => detectCollision(obstacles, { x, y: PLAYER_Y_POSITION }))
    .filter(isDead)
    .takeWhile(isAliveP2);

const Game$ = Observable.combineLatest(
    CurrentScoreP1$, CurrentScoreP2$, PlayerMovementP1$, PlayerMovementP2$, Obstacles$,
    (scoreP1, scoreP2, p1x, p2x, obstacles) => ({ scoreP1, scoreP2, p1x, p2x, obstacles })
).sample(Observable.interval(50)).takeWhile(isAliveP1 && isAliveP2);

// Input click para el boton replay
Observable.fromEvent(button, 'click').subscribe(replay);

// START THE GAME
startGame();

// Funcion que va creando y manejando los elementos:
function renderGame({ scoreP1, scoreP2, p1x, p2x, obstacles }) {
    clearCanvas();
    showP1Score(scoreP1);
    showP2Score(scoreP2);
    showP1({ x: p1x, y: PLAYER_Y_POSITION });
    showP2({ x: p2x, y: PLAYER_Y_POSITION });
    showObstacles(obstacles);
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
    LifeP1$.subscribe(_ => {
        IsAliveP1$.next(false);
        showButton();
    });
    LifeP2$.subscribe(_ => {
        IsAliveP2$.next(false);
        showButton();
    });
}

function replay() {
    IsAliveP1$.next(true);
    IsAliveP2$.next(true);
    hideButton();
    startGame();
    CurrentScoreP1$.take(1).subscribe(lastValue => {
        ScoreBehaviorP1$.next(lastValue * -1);
    });
    CurrentScoreP2$.take(1).subscribe(lastValue => {
        ScoreBehaviorP2$.next(lastValue * -1);
    });
}