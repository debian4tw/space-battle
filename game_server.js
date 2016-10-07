
var SpaceBattle = require('./public/javascripts/space_battle');

var gameServer = (function(){
	var gameRooms = {};
	var pendingRooms = {};
	var roomSocketsMap = {};
	var serv_io;
	/**
	Length of a tick in milliseconds. The denominator is your desired framerate.
	e.g. 1000 / 20 = 20 fps,  1000 / 60 = 60 fps
	*/
	var tickLengthMs = 1000 / 30;
	/* gameLoop related variables */
	// timestamp of each loop
	var previousTick = Date.now();
	// number of times gameLoop gets called
	var actualTicks = 0;

	function gameLoop() {

	    var now = Date.now();

	    actualTicks++;
	    if (previousTick + tickLengthMs <= now) {
	        var delta = (now - previousTick) / 1000
	        
	        previousTick = now;

	        update(delta);
	        //console.log('delta', delta, '(target: ' + tickLengthMs +' ms)', 'node ticks', actualTicks)
	        actualTicks = 0;
	    }

	    if (Date.now() - previousTick < tickLengthMs - 16) {
	        setTimeout(gameLoop);
	    } else {
	        setImmediate(gameLoop);
	    }
	};


	function init(p_serv_io){
		serv_io = p_serv_io;

		gameLoop();

		serv_io.on('connection', function (socket) {

		    socket.on('gameId', onPlayerConect);

		    socket.on('moved', onPlayerMoved);

		    socket.on('fired', onPlayerFired);

		    socket.on('disconnect', function() {
		        //console.log('Disconnect!');
		        onPlayerDisconect(socket);
		    });   

		});		
	};


	function update(delta) {

	    var state1;
	    var state2;

	    for (x in gameRooms) {
	    	
	    	state1 = {
	    		s: gameRooms[x].game.getState(),
	    		last : gameRooms[x].l1,
	    		t : gameRooms[x].t1
	    	};

	    	state2 = {
	    		s: gameRooms[x].game.getState(),
	    		last : gameRooms[x].l2,
	    		t : gameRooms[x].t2
	    	};		

	      	//setTimeout(function(){
      		try{
        		serv_io.sockets.sockets[gameRooms[x].s1].volatile.emit('state',state1);
        		
        	} catch(e){
        		console.log(e);
        	}
      		try{
        	serv_io.sockets.sockets[gameRooms[x].s2].volatile.emit('state',state2);
        		
        	} catch(e){
        		console.log(e);
        	}

	      	//},100);
	    }
	};


	function onPlayerConect(data){
		var socket = this;
        console.log('gameId '+data.id + ' t'+Date.now());
        if (pendingRooms[data.id]) {

            gameRooms[data.id] =  { s1 : pendingRooms[data.id].socketId, 
                                    s2: socket.id,
                                    game : new SpaceBattle(),
                                    l1 : 0,
                                    l2: 0,
                                    t1: 0,
                                    t2: 0
                                  };
            gameRooms[data.id][pendingRooms[data.id].socketId] = 1;
            gameRooms[data.id][socket.id] = 2;
            gameRooms[data.id].game.startFleet();

            roomSocketsMap[pendingRooms[data.id].socketId] = data.id;
            roomSocketsMap[socket.id] = data.id;

            delete pendingRooms[data.id];
            //console.log(roomSocketsMap);  
            //console.log(gameRooms);
        } else {
            console.log('grabo socket id');
            console.log(socket.id);
            pendingRooms[data.id] = {socketId : socket.id};
        }
	};

	function onPlayerMoved(data) {
		
		var socket = this;
	    var player;

	    //serv_io.sockets.emit('moved', {direction: data.direction});
	    //console.log(data);
        
        if(gameRooms[roomSocketsMap[socket.id]]){
          player = gameRooms[roomSocketsMap[socket.id]][socket.id];
          if (data.direction =='left') {
              //console.log('left '+player);
              gameRooms[roomSocketsMap[socket.id]].game['ship'+player].moveLeft();
              //game.ship1.moveLeft();
          } else {
              //game.ship1.moveRight();
              //console.log('right '+player);
              gameRooms[roomSocketsMap[socket.id]].game['ship'+player].moveRight();
          }
          gameRooms[roomSocketsMap[socket.id]]['l'+player] = data.i;
          gameRooms[roomSocketsMap[socket.id]]['t'+player] = data.t;
          //console.log('ult mov recibido: '+data.i);
          //console.log(gameRooms[roomSocketsMap[socket.id]]);
        }
	}	


	function onPlayerFired(data) {
      var socket = this;
      //game.ship1.fire();
      var player;
        if(typeof gameRooms[roomSocketsMap[socket.id]] !== 'undefined'){
            player = gameRooms[roomSocketsMap[socket.id]][socket.id];
            gameRooms[roomSocketsMap[socket.id]].game['ship'+player].fire();
        }
    }


	function onPlayerDisconect(socket){
		//var socket = this;
        var player;
        var otherPlayer;
        var roomId;

        if (typeof gameRooms[roomSocketsMap[socket.id]] !== 'undefined') {          
            roomId = roomSocketsMap[socket.id];
            player = gameRooms[roomSocketsMap[socket.id]][socket.id];
            otherPlayer = (player == 1) ? 2 : 1; 
            //console.log('player'+player +', other player'+otherPlayer);          
            pendingRooms[roomId] = { socketId : gameRooms[roomId]['s'+otherPlayer]}
            
            delete gameRooms[roomSocketsMap[socket.id]];
            delete roomSocketsMap[socket.id];
        } else {
            roomId = roomSocketsMap[socket.id];
            delete pendingRooms[roomId];       
            delete roomSocketsMap[socket.id];
        }

	};

	return{
		init: init,
		gameLoop: gameLoop,
		onPlayerConect: onPlayerConect,
		onPlayerDisconect: onPlayerDisconect,
		onPlayerFired: onPlayerFired,
		onPlayerMoved: onPlayerMoved
	}

})();

module.exports = gameServer;

