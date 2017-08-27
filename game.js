var s;
var f;

var scl = 20;
var canvas_width = 25;
var canvas_height = 25;

var canvas;

var up;
var downM
var left;
var right;

function setup() {
	scl = 1;
	while (windowWidth > scl * canvas_width && windowHeight > scl * canvas_height + 60) {
		scl++;
	}

	canvas = createCanvas(canvas_width * scl, canvas_height * scl);
	canvas.parent('sketch-holder');

	frameRate(15);

	up = createVector(canvas_width * scl / 2, 0);
	down = createVector(canvas_width * scl / 2, canvas_height * scl);
	left =  createVector(0, canvas_height * scl / 2);
	right = createVector(windowWidth, canvas_height * scl / 2);

	s = new Snake();
	f = new Food();
	f.place();
}

function windowResized() {
	scl = 1;
	while(windowWidth > scl * canvas_width + 50 && windowHeight > scl * canvas_height + 50) {
		scl++;
	}

	resizeCanvas(canvas_width * scl, canvas_height * scl);

	up = createVector(windowWidth / 2, 0);
	down = createVector(windowWidth / 2, windowHeight);
	left =  createVector(0, windowHeight / 2);
	right = createVector(windowWidth, windowHeight / 2);
}

function draw() {
	background(0);
  	background(30);

	textSize(13);
	fill(135);
	text("Score: " + s.length, canvas_width * scl - 75, canvas_height * scl - 25)

	f.show();
	s.update();
	s.show();
}

function saveScore(score) {
	if (score < 10)
		return;

	var username = prompt("New Highscore! Enter your name", "Anonymous");
	window.alert(username + ": " + score + "!");
}

function Snake() {
	this.x = 1;
	this.y = randomInt(canvas_height);
	this.xspeed = 1;
	this.yspeed = 0;

	this.xspeed_next = this.xspeed;
	this.yspeed_next = this.yspeed;

	this.length = 0;
	this.tail = [];

	this.update = function() {
		this.xspeed = this.xspeed_next;
		this.yspeed = this.yspeed_next;

		for (i = 0; i < this.tail.length - 1; i++) {
			this.tail[i] = this.tail[i + 1];
		}
		this.tail[this.length - 1] = createVector(this.x, this.y);

		this.x += this.xspeed;
		this.y += this.yspeed;

		if (this.x >= canvas_width || this.y >= canvas_height || this.x < 0 || this.y < 0 || this.hitsTail(this.x, this.y)) {
			this.kill();
			return;
		}

		this.x = constrain(this.x, 0, canvas_width - 1);
		this.y = constrain(this.y, 0, canvas_height - 1);

		if (this.x === f.x && this.y === f.y) {
			f.place();

			this.length++;
			this.tail.push(createVector(this.x, this.y));
		}
	}

	this.show = function() {
		for (i = 0; i < this.tail.length; i++) {
			fill(255 - 5 * i);
			rect(this.tail[i].x * scl, this.tail[i].y * scl, scl, scl);
		}

		fill(255);
		rect(this.x * scl, this.y * scl, scl, scl);
	}

	this.kill = function() {
		saveScore(this.length);

		this.x = 1;
		this.y = randomInt(canvas_height);
		this.xspeed = 1;
		this.yspeed = 0;
		this.xspeed_next = this.xspeed;
		this.yspeed_next = this.yspeed;

		this.length = 0;
		this.tail = [];
	}

	this.hitsTail = function(x, y) {
		for (i = 0; i < this.tail.length; i++) {
			if (this.tail[i].x === x && this.tail[i].y === y)
				return true;
		}

		return false;
	}

	this.dir = function(x, y) {
		if (x != -this.xspeed && y != -this.yspeed) {
			this.xspeed_next = x;
			this.yspeed_next = y;
		}
	}
}

function Food() {
	this.x = randomInt(canvas_width);
	this.y = randomInt(canvas_height);

	this.place = function() {
		while ((this.x === s.x && this.y === s.y) || s.hitsTail(this.x, this.y)) {
			this.x = randomInt(canvas_width);
			this.y = randomInt(canvas_height);
		}
	}

	this.show = function() {
		fill(117, 52, 228);
		ellipse(this.x * scl + (0.5 * scl), this.y * scl + (0.5 * scl), scl, scl);
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW)
		s.dir(0, -1);
	else if (keyCode === DOWN_ARROW)
		s.dir(0, 1);
	else if (keyCode === LEFT_ARROW)
		s.dir(-1, 0);
	else if (keyCode === RIGHT_ARROW)
		s.dir(1, 0);
}

function moveUp() {
	s.dir(0, -1);
}

function moveDown() {
	s.dir(0, 1);
}

function moveLeft() {
	s.dir(-1, 0);
}

function moveRight() {
	s.dir(1, 0);
}

function screenClick(e) {
	var x = e.changedTouches[0].pageX;
	var y = e.changedTouches[0].pageY;


	var distUp = distanceTo(x, y, up.x, up.y);
	var distDown = distanceTo(x, y, down.x, down.y);
	var distLeft = distanceTo(x, y, left.x, left.y);
	var distRight = distanceTo(x, y, right.x, right.y);

	var shortest = distUp;
	if (distDown < shortest)
		shortest = distDown;
	if (distLeft < shortest)
		shortest = distLeft;
	if (distRight < shortest)
		shortest = distRight;

	if (shortest === distUp)
		moveUp();
	else if (shortest === distDown)
		moveDown();
	else if (shortest === distLeft)
		moveLeft();
	else if (shortest === distRight)
		moveRight();
}

function distanceTo(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;

	return Math.sqrt(a*a + b*b);
}

function randomInt(min, max) {
	Math.floor(Math.random() * max) + min;
}

function randomInt(max) {
	return Math.floor(Math.random() * max);
}
