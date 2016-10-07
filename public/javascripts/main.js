var SpaceBattle = require('./space_battle');
var io = require('socket.io-client');


  	var fpsContainer = $('#fps');
	var limitLoop = function (fn, fps) {
	 
	    // Use var then = Date.now(); if you
	    // don't care about targetting < IE9
	    var then = new Date().getTime();
	 
	    // custom fps, otherwise fallback to 60
	    var fps = fps || 50;
	    var fpsCount;
	    var interval = 1000 / fps;
	 	var oldtime = +new Date;
	    return (function loop(time){
	        requestAnimationFrame(loop);
	 		//var oldtime;
	        // again, Date.now() if it's available
	        var now = new Date().getTime();
	        var delta = now - then;
	 		
	        if (delta > interval) {
	            // Update time
	            // now - (delta % interval) is an improvement over just 
	            // using then = now, which can end up lowering overall fps
	            //console.log(delta);
	            fpsCount = 1000/(time-oldtime)
        		oldtime = time;
	            fpsContainer.text(Math.round(fpsCount,10));
	            then = now - (delta % interval);
	 
	            // call the fn
	            fn();
	        }
	    }(0));
	};



	var adress = config.server;
	socket = io.connect(adress);
	console.log('conecting to '+adress);
  	//var socket = io.connect('http://localhost:3000');
  	//var socket = io.connect('http://108.59.6.220:10834');  
  	console.log(socket);	
	var canvas = document.getElementById("canvas");
  	var ctx = canvas.getContext("2d");

  	var queryStr = {};
  	location.search.substr(1).split("&").forEach(function(item) {queryStr[item.split("=")[0]] = item.split("=")[1]})

  	console.log(queryStr.id);
  	socket.emit('gameId', { id : queryStr.id });
  	console.log('gameId t: '+Date.now());
	
	var game = new SpaceBattle(socket);
	
	window.addEventListener('keydown', function(e){game.keyPressed(e)}, true);
	//$(window).keypress(function(e){game.keyPressed(e)});
	window.addEventListener('keyup', function(e){game.keyUp(e)}, true);
	
	var ni =0;
	setInterval(function(){
		game.handleMove(ni);
		ni++;
	},30);
	//requestAnimFrame(function(){
  		
	//});
	limitLoop(function(){game.draw(ctx);},48);
	
	var latencyContainer = $('#latency');
	
	socket.on('state',function(data){
		console.log(data);
		//console.log(data.last);
		game.setState(data.s);
		if(game.commands[data.last]){
			//console.log('Latency: ',Date.now() - game.commands[data.last]);
			latencyContainer.text(Date.now() - game.commands[data.last]);
			delete game.commands[data.last];
		}
	});
	
	/*socket.on('moved', function (data) {
  	//console.log(data);
  	if(data.direction == 'right'){
  		game.ship2.moveX(game.ship2.speed);
  	} else {
  		game.ship2.moveX(-game.ship2.speed);
  	}
  	//socket.emit('my other event', { my: 'AAASSssDDD' });
	});*/


	/*socket.on('fired',function(data){
		game.ship2.fire();
		game.getState();
	});*/
