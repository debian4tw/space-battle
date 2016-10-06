(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('bullet',[], factory);
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


//Constructor
var Bullet = function(x,y,color){

	var GameOpts = {
    screenW : 800,
    screenH : 600
    };
	//this.canvas = document.getElementById("canvas");
    //this.ctx = canvas.getContext("2d");

	this.rectangle = {x:x,y:y,w:10,h:25};
	this.speed = 25;
	this.color = color;
	this.state = 0;
};

Bullet.prototype.moveX = function(x){
	this.rectangle.x += x;
};

Bullet.prototype.moveY = function(y){
	if (this.orientation == 1) {
		this.rectangle.y -= y;
	} else {
		this.rectangle.y += y;
	}
};

Bullet.prototype.getX = function(){
	return this.rectangle.x;
};

Bullet.prototype.getY = function(){
	return this.rectangle.y;
};

Bullet.prototype.getW = function(){
	return this.rectangle.w;
};

Bullet.prototype.getH = function(){
	return this.rectangle.h;
};

Bullet.prototype.fire = function(x,y){
	if(this.state == 0) {
		this.position(x,y);
		this.state = 1;
	}
};

Bullet.prototype.position = function(x,y){
	this.rectangle.x = x;
	this.rectangle.y = y;
};
Bullet.prototype.reset = function(){
	this.state = 0;
	this.rectangle.x = -50;
	this.rectangle.y = -50;
};

Bullet.prototype.draw = function(ctx){ 

	if (this.state == 1) {
		//if (this.getY() < GameOpts.screenH && this.getY() > 0) {
			//this.moveY(this.speed);
			ctx.fillStyle = this.color;
			ctx.fillRect(this.getX(),this.getY(),this.getW(),this.getH());
		//} else {
		//	this.reset();
		//}
	}
};

Bullet.prototype.getState = function(){
		var GameOpts = {
    	screenW : 800,
    	screenH : 600
    };
	if (this.state == 1) {
		if (this.getY() < GameOpts.screenH && this.getY() > 0) {
			this.moveY(this.speed);
			//ctx.fillStyle = this.color;
			//ctx.fillRect(this.getX(),this.getY(),this.getW(),this.getH());
		} else {
			this.reset();
		}
	} else{
		//return;
	}
	return {s: this.state, x: this.rectangle.x, y: this.rectangle.y};
}

Bullet.prototype.setState = function(data){
	this.state = data.s;
	this.rectangle.x = data.x;
	this.rectangle.y = data.y;
}


	return Bullet;
}));
