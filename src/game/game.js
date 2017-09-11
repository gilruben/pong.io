import Paddle from './paddle.js';
import Ball from './ball.js';

function Game(width, height) {
  this.width = width;
  this.height = height;
  this.ball = null;
  this.you = null;
  this.other = null;
  this.socket = null;
  this.canvas = null;
  this.serveSide = 1;
  this.lastY = 20;
}

//creates the canvas where the game will take place
Game.prototype.init = function(selfSide, oppSide, socket) {
  this.socket = socket;
  this.canvas = document.createElement('canvas');
  this.canvas.setAttribute('width', this.width);
  this.canvas.setAttribute('height', this.height);

  $('div').html(this.canvas);

  document.addEventListener('keydown', this.handleKeyPress.bind(this), false);

  this.you = new Paddle(selfSide, this.canvas);
  this.other = new Paddle(oppSide, this.canvas);
  this.ball = new Ball(10, this.width/2, this.height/2, 500, this.canvas, {width: this.you.width, height: this.you.height});
}

//handles up arrow key presses and down arrow key presses
Game.prototype.handleKeyPress = function(e) {
  e.preventDefault();

  let keycode = e.keyCode;

  switch (keycode) {
    case 38:
    console.log('up');
    this.you.moveUp();
    break;
    case 40:
    console.log('down');
    this.you.moveDown();
    break;
  }

}


Game.prototype.start = function() {
  let that = this;
  let ctx = this.canvas.getContext('2d');

  this.socket.on('update', function(data){
    console.log('Opponent Position:', data.y)
    if(data.y !== undefined) that.other.y = data.y;
  })

  this.socket.emit('startMatch');

  function tick(event){
    // Y positions of player 1 and player 2
    let y1;
    let y2;

    if (that.you.side === 1) {
      y1 = that.you.y
      y2 = that.other.y
    } else {
      y1 = that.other.y
      y2 = that.you.y
    }

    ctx.clearRect(0, 0, that.width, that.height);
    that.ball.move(that.serveSide, { y1, y2 }, event.delta);
    that.ball.render();
    that.you.render();
    that.other.render();

    if(that.you.y !== that.lastY){
      that.lastY = that.you.y
      that.socket.emit('move', {y: that.lastY});
    }
  }


  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick)
}

export default Game;