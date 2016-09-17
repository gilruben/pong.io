// requirejs.config({
//
//     baseUrl: '.',
//
//     paths: {
//         paddle: './paddle',
//         game: './game'
//     }
// });

requirejs(['game'], function (Game) {
	var socket = io();
	var playerId;


	$('#play').on('click', function(){
		//console.log('button')
		//var msg = $('textarea').val();
		socket.emit('play');

		//event listener that listens for when the server gives the client an id
		socket.on('assignId', function(data){
			playerId = data.id;

			//console.log(socket.id)
			$('div').html('<h1>Waiting for player...<h1>');
			socket.emit('waiting', {id: playerId})

		})

	})


	socket.on('startGame', function(data){
		$('div').html('<h1>Starting game<h1>');
		var pongGame = new Game(600, 400);

		//if the id of the socket is equal to the id in data.left then the
		//current player's paddle will be placed on the left side
		if(('/#' + socket.id) === data.left){
			pongGame.init(1, 2, socket);
      //console.log(pongGame)
			//console.log('socketID: ' + socket.id);
			//console.log("On the left side id: " + data.left);
		} else {
			pongGame.init(2, 1, socket);
			//console.log('socketID: ' + socket.id);
			//console.log("On the right side id: " + data.right);
		}

    pongGame.start();

	})
});
