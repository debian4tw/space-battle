(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define('fleet',[], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.returnExports = factory();
  }
}(this, function () {

	// Just return a value to define the module export.
	// This example returns an object, but the module
	// can return a function as the exported value.
	
//Constructor
var Fleet = function(x,y,color){

	var i;
	this.qty = 18;
	this.speed = 20;
	this.color = color;	
	this.rectangle = [];
	this.active = [];
	this.aliveShips = this.qty;
	this.direction = 0;
	
	startx = x;
	dist = 60;
	for(i=0;i<this.qty;i++){
	 this.rectangle[i] = {x:x,y:y,w:30,h:30};
	 x= x+dist;
	 	if(i != 0 && (i+1) % 6 == 0){
	 		y = y+dist;
	 		x = startx;
		}
	}

	for (i=0;i<this.qty;i++) {
		this.active[i] = 1;
	}

	//console.log('created Fleet color'+this.color);
};

Fleet.prototype.moveX = function(x){
		var GameOpts = {
	screenW : 800,
	screenH : 600
	};
	/*
	if ( (x<0 && this.rectangle.x+x < 0 ) || 
		 (x>0 && this.rectangle.x+this.rectangle.w+x > GameOpts.screenW ) ){
		return;
	}
	*/

	for(i=0;i<this.qty;i++){
	 this.rectangle[i].x+=x;
	}
};

Fleet.prototype.moveLeft = function(){
	this.moveX(-this.speed);
}
Fleet.prototype.moveRight = function(){
	this.moveX(this.speed);
}

Fleet.prototype.moveY = function(y){
	this.rectangle.y += y;
};

Fleet.prototype.getX = function(){
	return this.rectangle.x;
};

Fleet.prototype.getY = function(){
	return this.rectangle.y;
};

Fleet.prototype.getW = function(){
	return this.rectangle.w;
};

Fleet.prototype.getH = function(){
	return this.rectangle.h;
};

Fleet.prototype.asignBullet = function(b){
	this.bullet = b;
};

Fleet.prototype.fire = function(){
	var j=-1;
	var pos=0;
	var fireFrom = this.getRandomInt(0,this.aliveShips+1);
	fireFrom = fireFrom-1;
	//console.log('alive ships '+this.aliveShips);
	//console.log('fire from ' +fireFrom);
	for (i=0; i<this.qty; i++){

		if(this.active[i]){
			j++;
		}
		if(j == fireFrom){
			pos = i;
			break;
		}
	}
	//console.log('pos ' +pos);

	this.bullet.fire(this.rectangle[pos].x + this.rectangle[pos].w / 2,this.rectangle[pos].y + this.rectangle[pos].h / 2);
	if(this.bullet.orientation==0){
		this.bullet.orientation=1;
	}else{
		this.bullet.orientation = 0;
	}
};

Fleet.prototype.getRandomInt = function(max,min){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Fleet.prototype.draw = function(ctx){
	var i;
	//console.log(this.aliveShips);

	for(i=0;i<this.qty;i++){
		if (this.active[i]) {	 
			ctx.fillStyle = this.color;
			ctx.fillRect(this.rectangle[i].x,this.rectangle[i].y,this.rectangle[i].w,this.rectangle[i].h);
		}
	}

};

Fleet.prototype.getState = function(){
	
	if(this.aliveShips == 0){
		for(i=0;i<this.qty;i++){
			this.active[i] = 1;
		}
		this.aliveShips = this.qty;	
	}

	return {x:this.rectangle[0].x, y: this.rectangle[0].y, active : this.active};
}

Fleet.prototype.setState = function(data){
	var startx,x,y,dist;
	/*this.rectangle.x = data.x;
	this.rectangle.y = data.y*/
	this.active = data.active;
	x = data.x;
	y = data.y;

	startx = x;
	dist = 60;
	for(i=0;i<this.qty;i++){
	 this.rectangle[i] = {x:x,y:y,w:30,h:30};
	 x= x+dist;
	 	if(i != 0 && (i+1) % 6 == 0){
	 		y = y+dist;
	 		x = startx;
		}
	}

}

return Fleet;
}));

//define('Fleet',function(){


//	return Fleet;

//});