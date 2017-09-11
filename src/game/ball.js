function Ball(radius, centerX, centerY, speed, canvas, paddleDim) {
	this.radius = radius;
	this.centerX = centerX;
	this.centerY = centerY;
	this.startPoint = {x: centerX, y: centerY};
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.speed = speed;
	this.paddleDim = paddleDim;
	this.direction = {x: -1, y: 1};
	this.timePassed = 0;
	this.ballOutOfBounds = false;
}

//moves the ball
//startPoint is an object with keys x and y, of where the ball will start
//side will determine the direction, 1 is left, 2 is right;
//paddle is an object that stores where the paddles are in the y-axis
Ball.prototype.move = function (side, paddlePos, timePassed, allInfo){
	this.timePassed += timePassed;
	// console.log('Time Passed:', timePassed);
	if(this.timePassed >= 1000/this.speed){
		let moveX;
		let moveY;
		let newCenterX;
		let newCenterY;

		if(!this.ballOutOfBounds){
			//how much to move centerX and centerY
			moveX = this.direction.x * Math.round(this.timePassed / (1000/this.speed));
			moveY = this.direction.y * Math.round(this.timePassed / (1000/this.speed));

			//new x and y's for the center if the previous center were to move moveX or moveY respectively
			newCenterX = moveX + this.centerX;
			newCenterY = moveY + this.centerY;
		}


		// //redirects ball when it hits the edges of the x-axis by setting a new x coordinate
		// if(newCenterX < this.radius){
		// 	this.centerX = newCenterX * -1;
		// 	this.direction.x *= -1;
		// } else if(newCenterX > this.canvas.width - this.radius){
		// 	this.centerX = (2 * this.canvas.width) - newCenterX;
		// 	this.direction.x *= -1;
		// } else {
		// 	this.centerX = newCenterX
		// }

		if(newCenterX < (0 - (2 * this.radius)) || newCenterX > this.canvas.width + (2 * this.radius)){
			let that = this;
			this.ballOutOfBounds = true;

			setTimeout(function(){
				that.centerX = that.startPoint.x;
				that.centerY = that.startPoint.y;
				that.ballOutOfBounds = false;
			}, 2000)
		} else if(this.ballHitsPaddle(newCenterX, newCenterY, paddlePos)){
			let canvasWidth = this.canvas.width;
			let paddWidth = this.paddleDim.width;

			// Distance beginning of the canvas to the right side of the left paddle.
			let leftPaddDist = 20 + paddWidth;
			// Distance from the left side of the right paddle to the end of the canvas.
			let rightPaddDist = canvasWidth - 20 - paddWidth

			// Chooses LeftPaddDist or rightPaddDist depending on which direction the
			// ball is currently headed
			let contactPaddDist = (this.direction.x === -1) ? leftPaddDist : rightPaddDist;

			// Where the ball will be after it has bounced off the paddle
			moveX = (-1 * moveX) - (this.centerX - contactPaddDist);

			this.centerX += moveX;
			this.direction.x *= -1;
		} else {
			this.centerX = newCenterX
		}


		//redirects ball when it hits the edges of the y-axis by setting a new y coordinate
		if(!this.ballOutOfBounds){
			if(newCenterY < this.radius){
				this.centerY = newCenterY * -1
				this.direction.y *= -1;
			} else if(newCenterY > this.canvas.height - this.radius){
				this.centerY = (2 * this.canvas.height) - newCenterY;
				this.direction.y *= -1;
			} else {
				this.centerY = newCenterY;
			}
		}

		//reset time passed
		this.timePassed = 0;
	}
}

Ball.prototype.ballHitsPaddle = function (ballX, ballY, paddlePos) {
	let isTouchingLeftPaddle = (ballX <= (20 + this.paddleDim.width)) && (ballX >= 20) && (ballY >= paddlePos.y1) && (ballY <= (paddlePos.y1 + this.paddleDim.height))
	let isTouchingRightPaddle = (ballX >= (600 - 20 - this.paddleDim.width)) && (ballX <= 600 - 20) && (ballY >= paddlePos.y2) && (ballY <= (paddlePos.y2 + this.paddleDim.height))

	if(isTouchingLeftPaddle || isTouchingRightPaddle){
		console.log('Paddle Position:', paddlePos)
		return true;
	} else {
		return false;
	}
}

Ball.prototype.render = function () {
	this.ctx.beginPath();
	this.ctx.fillStyle = "white";
	this.ctx.arc(
		this.centerX,
		this.centerY,
		this.radius,
		0,
		2 * Math.PI,
		false
	);

	this.ctx.fill();
}

export default Ball;