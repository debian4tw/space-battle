var GameOpts = require('./game_opts');
//Constructor
var Bonus = function(x,y,color){


	//this.canvas = document.getElementById("canvas");
    //this.ctx = canvas.getContext("2d");

	this.rectangle = {x:x,y:y,w:50,h:40};
	this.speed = 20;
	this.color = color;
	this.bullet = false;
	this.direction = 0;
	//console.log('created Bonus color'+this.color);
};

Bonus.prototype.moveX = function(x){

	if ( (x<0 && this.rectangle.x+x < 0 ) || 
		 (x>0 && this.rectangle.x+this.rectangle.w+x > GameOpts.screenW ) ){
		return;
	}

	this.rectangle.x += x;
};

Bonus.prototype.moveLeft = function(){
	this.moveX(-this.speed);
}
Bonus.prototype.moveRight = function(){
	this.moveX(this.speed);
}

Bonus.prototype.moveY = function(y){
	this.rectangle.y += y;
};

Bonus.prototype.getX = function(){
	return this.rectangle.x;
};

Bonus.prototype.getY = function(){
	return this.rectangle.y;
};

Bonus.prototype.getW = function(){
	return this.rectangle.w;
};

Bonus.prototype.getH = function(){
	return this.rectangle.h;
};

Bonus.prototype.asignBullet = function(b){
	this.bullet = b;
};

Bonus.prototype.fire = function(){
	this.bullet.fire(this.getX() + this.getW() / 2,this.getY());
};

Bonus.prototype.draw = function(ctx){
	ctx.fillStyle = this.color;
	ctx.fillRect(this.getX(),this.getY(),this.getW(),this.getH());
};

Bonus.prototype.getState = function(){
	return {x:this.rectangle.x, y: this.rectangle.y};
}

Bonus.prototype.setState = function(data){
	this.rectangle.x = data.x;
	this.rectangle.y = data.y
}

module.exports = Bonus;

