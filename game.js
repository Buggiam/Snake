var s;
var f;

var scl = 20;
var canvas_width = 25;
var canvas_height = 25;

function setup() {
	createCanvas(canvas_width * scl, canvas_height * scl);
	frameRate(15);

	s = new Snake();
	f = new Food();
	f.place();
}

function draw() {
  	background(30);
	f.show();
	s.update();
	s.show();
}

function Snake() {
	this.x = 1;
	this.y = randomInt(canvas_height);
	this.xspeed = 1;
	this.yspeed = 0;

	this.length = 0;
	this.tail = [];

	this.update = function() {
		//GO DOWN
		for (i = 0; i < this.tail.length; i++) {
			this.tail[i] = this.tail[i+1];
		}

		this.x += this.xspeed;
		this.y += this.yspeed;

		if (this.x >= canvas_width || this.y >= canvas_height || this.x < 0 || this.y < 0) {
			this.kill();
			return;
		}

		this.x = constrain(this.x, 0, canvas_width - 1);
		this.y = constrain(this.y, 0, canvas_height - 1);

		if (this.x === f.x && this.y === f.y) {
			f.place();

			length++;
			this.tail.push([this.x, this.y]);
		}
	}

	this.show = function() {
		fill(255);
		rect(this.x * scl, this.y * scl, scl, scl);

		fill(170);
		for (i = 0; i < this.tail.length; i++) {
			//you
			rect(this.tail[i][0] * scl, this.tail[i][1] * scl, scl, scl);
		}
	}

	this.kill = function() {
		this.x = 1;
		this.y = randomInt(canvas_height);
		this.xspeed = 1;
		this.yspeed = 0;
	}

	this.dir = function(x, y) {
		if (x != -this.xspeed)
			this.xspeed = x;
		if (y != -this.yspeed)
			this.yspeed = y;
	}
}

function Food() {
	this.x = randomInt(canvas_width);
	this.y = randomInt(canvas_height);

	this.place = function() {
		while (this.x === s.x && this.y === s.y) {
			this.x = randomInt(canvas_width);
			this.y = randomInt(canvas_height);
		}
	}

	this.show = function() {
		fill(117, 52, 228);
		rect(this.x * scl, this.y * scl, scl, scl);
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

function randomInt(min, max) {
	Math.floor(Math.random() * max) + min;
}

function randomInt(max) {
	return Math.floor(Math.random() * max);
}
