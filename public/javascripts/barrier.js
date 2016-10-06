(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define('barrier',[], factory);
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
var Barrier = function(x,y,color,reverseOrientation){

	var i;
	this.qty = 27;
	this.speed = 20;
	this.color = color;	
	this.rectangle = [];
	this.active = [];

	if (reverseOrientation) {
		this.omit = [7,16,25];	
	} else {
		this.omit = [1,10,19];
	}

	startx = x;
	starty = y;
	dist = 35;
	offsetBarrier = 200;

	for (i=0;i<this.qty;i++) {
	 	this.rectangle[i] = {x:x,y:y,w:30,h:15};
	 	x= x+dist;
	 	if(i != 0 && (i+1) % 3 == 0){
	 		y = y+dist/2;
	 		x = startx;
		}

		if (i != 0 && (i+1) % 9 == 0) {
			x=startx=startx+offsetBarrier;
			y = starty;
		}
	}

	for (i=0;i<this.qty;i++) {
		if(this.omit.indexOf(i) !=-1){
			this.active[i] = 0;
		} else{
			this.active[i] = 1;
		}
	}
	//console.log('created Barrier color'+this.color);
};

Barrier.prototype.moveX = function(x){
		var GameOpts = {
	screenW : 800,
	screenH : 600
	};
	if ( (x<0 && this.rectangle.x+x < 0 ) || 
		 (x>0 && this.rectangle.x+this.rectangle.w+x > GameOpts.screenW ) ){
		return;
	}

	this.rectangle.x += x;
};

Barrier.prototype.moveLeft = function(){
	this.moveX(-this.speed);
}
Barrier.prototype.moveRight = function(){
	this.moveX(this.speed);
}

Barrier.prototype.moveY = function(y){
	this.rectangle.y += y;
};

Barrier.prototype.getX = function(){
	return this.rectangle.x;
};

Barrier.prototype.getY = function(){
	return this.rectangle.y;
};

Barrier.prototype.getW = function(){
	return this.rectangle.w;
};

Barrier.prototype.getH = function(){
	return this.rectangle.h;
};

Barrier.prototype.asignBullet = function(b){
	this.bullet = b;
};

Barrier.prototype.fire = function(){
	this.bullet.fire(this.getX() + this.getW() / 2,this.getY());
};

Barrier.prototype.draw = function(ctx){
	var i;
	for(i=0;i<this.qty;i++){	
		if(this.active[i] == 1){ 
			ctx.fillStyle = this.color;
			ctx.fillRect(this.rectangle[i].x,this.rectangle[i].y,this.rectangle[i].w,this.rectangle[i].h);
		}
	}

};

Barrier.prototype.getState = function(){
	return {active : this.active};
}

Barrier.prototype.setState = function(data){
	/*this.rectangle.x = data.x;
	this.rectangle.y = data.y*/
	this.active = data.active;
}

return Barrier;
}));

//define('Barrier',function(){


//	return Barrier;

//});