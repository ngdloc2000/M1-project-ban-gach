const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d"); // Dùng để vẽ hình ảnh

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const BALL_RADIUS = 8;
let LIFE = 3;
let SCORE = 0;
const SCORE_UNIT = 10;
const SCORE_BONUS = 100;
let LEVEL = 1;
const MAX_LEVEL = 4;
let leftArrow = false;
let rightArrow = false;
let GAME_OVER = false;

// TẠO ẢNH BACKGROUND ĐỂ XÓA CANVAS
const BG_IMG = new Image();
BG_IMG.src = "img/a.jpg";
// TẠO ẢNH MẠNG SỐNG
const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

// TẠO ẢNH CẤP ĐỘ
const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";

// TẠO ẢNH ĐIỂM SỐ
const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

// CREATE PADDLE
let paddle = {
	x: cvs.width / 2 - PADDLE_WIDTH / 2,
	y: cvs.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
	width: PADDLE_WIDTH,
	height: PADDLE_HEIGHT,
	dx: 7,
};

ctx.lineWidth = 3; // Làm dày viền của viên gạch
function drawPaddle() {
	ctx.fillStyle = "#2e3548";
	ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	ctx.strokeStyle = "#ffcd05";
	ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// SỰ KIỆN BẤM PHÍM KEYDOWN, KEYUP
document.addEventListener("keydown", function (event) {
	if (event.keyCode == 37) {
		leftArrow = true;
	} else if (event.keyCode == 39) {
		rightArrow = true;
	}
});

document.addEventListener("keyup", function (event) {
	if (event.keyCode == 37) {
		leftArrow = false;
	} else if (event.keyCode == 39) {
		rightArrow = false;
	}
});

function movePaddle() {
	if (rightArrow && paddle.x + paddle.width < cvs.width) {
		paddle.x += paddle.dx;
	} else if (leftArrow && paddle.x > 0) {
		paddle.x -= paddle.dx;
	}
}

// CREATE THE BALL
let ball = {
	x: cvs.width / 2,
	y: paddle.y - BALL_RADIUS,
	radius: BALL_RADIUS,
	speed: 5,
	dx: 3 * (Math.random() * 2 - 1),
	dy: -3,
};

// DRAW THE BALL
function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.strokeStyle = "#2e3548";
	ctx.stroke();
	ctx.fillStyle = "#fff";
	ctx.fill();
	ctx.closePath();
}

// MOVE THE BALL
function moveBall() {
	ball.x += ball.dx;
	ball.y += ball.dy;
}

// BALL WALL COLLISION
function ballWallCollision() {
	if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
		ball.dx = -ball.dx;
	}
	if (ball.y - ball.radius < 0) {
		ball.dy = -ball.dy;
	}
	if (ball.y + ball.radius > cvs.height) {
		LIFE--;
		resetBall();
	}
}

// RESET BALL
function resetBall() {
	ball.x = cvs.width / 2;
	ball.y = paddle.y - BALL_RADIUS;
	ball.dx = 3 * (Math.random() * 2 - 1);
	ball.dy = -3;
}

// BALL PADDLE COLLISION
function ballPaddleCollision() {
	if (ball.y > paddle.y && ball.y < paddle.y + paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
		let collidePoint = ball.x - (paddle.x + paddle.width / 2);
		collidePoint = collidePoint / (paddle.width / 2);
		let angle = (collidePoint * Math.PI) / 3;
		ball.dx = ball.speed * Math.sin(angle);
		ball.dy = -ball.speed * Math.cos(angle);
	}
}

// CREATE THE BRICKS
let brick = {
	row: 3,
	column: 10,
	width: 65,
	height: 20,
	offSetLeft: 20,
	offSetTop: 20,
	marginTop: 40,
	fillColor: ["#2e3548", "red"],
	strokeColor: "#fff",
};

let bricks = [];
function createBricks() {
	for (let r = 0; r < brick.row; r++) {
		bricks[r] = [];
		for (let c = 0; c < brick.column; c++) {
			bricks[r][c] = {
				x: c * brick.width + brick.offSetLeft,
				y: r * (brick.height + brick.offSetTop) + brick.offSetTop + brick.marginTop,
				status: true,
			};
		}
	}
}
createBricks();
let r_random = Math.floor(Math.random() * brick.row);
let c_random = Math.floor(Math.random() * brick.column);
// DRAW THE BRICKS
function drawBricks() {
	for (let r = 0; r < brick.row; r++) {
		for (let c = 0; c < brick.column; c++) {
			if (bricks[r][c].status) {
				ctx.fillStyle = brick.fillColor[0];
				ctx.fillRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
				ctx.strokeStyle = brick.strokeColor;
				ctx.strokeRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height);
			}
			if (bricks[r][c] == bricks[r_random][c_random]) {
				ctx.fillStyle = brick.fillColor[1];
				ctx.fillRect(bricks[r_random][c_random].x, bricks[r_random][c_random].y, brick.width, brick.height);
				ctx.strokeStyle = brick.strokeColor;
				ctx.strokeRect(bricks[r_random][c_random].x, bricks[r_random][c_random].y, brick.width, brick.height);
			}
		}
	}
}

// BALL BRICK COLLISION
function ballBrickCollision() {
	for (let r = 0; r < brick.row; r++) {
		for (let c = 0; c < brick.column; c++) {
			let b = bricks[r][c];
			let b1 = bricks[r_random][c_random];
			if (b.status) {
				if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
					ball.dy = -ball.dy;
					b.status = false;
					SCORE += SCORE_UNIT;
				}
			}
			// if (b1.status) {
			// 	if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
			// 		ball.dy = -ball.dy;
			// 		b1.status = false;
			// 		SCORE += SCORE_BONUS;
			// 	}
			// }
		}
	}
}

// SHOW GAME
function showGame(text, textX, textY, img, imgX, imgY) {
	// draw text
	ctx.fillStyle = "#FFF";
	ctx.font = "25px Germania One";
	ctx.fillText(text, textX, textY);

	//draw image
	ctx.drawImage(img, imgX, imgY, (width = 25), (height = 25));
}

function gameOver() {
	if (LIFE <= 0) {
		GAME_OVER = true;
	}
}

function levelUp() {
	let isBreakAllBricks = true;
	for (let r = 0; r < brick.row; r++) {
		for (let c = 0; c < brick.column; c++) {
			isBreakAllBricks = isBreakAllBricks && !bricks[r][c].status;
		}
	}

	if (isBreakAllBricks) {
		brick.row++;
		createBricks();
		ball.speed += 0.5;
		resetBall();
		LEVEL++;
	}
}

//             MAIN
function draw() {
	drawPaddle();
	drawBall();
	drawBricks();
	showGame(SCORE, 35, 25, SCORE_IMG, 5, 5);
	showGame(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);
	showGame(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
}

function update() {
	movePaddle();
	moveBall();
	ballWallCollision();
	ballPaddleCollision();
	ballBrickCollision();
	gameOver();
	levelUp();
}

function loop() {
	ctx.drawImage(BG_IMG, 0, 0);
	draw();
	update();
	if (!GAME_OVER && LEVEL < MAX_LEVEL) {
		requestAnimationFrame(loop);
	}
}
loop();
