
var Ship = function(x,y,color){

	this.rectangle = {x:x,y:y,w:60,h:40};
	this.speed = 20;
	this.color = color;
	this.bullet = false;
	//console.log('created ship color'+this.color);
};

Ship.prototype.moveX = function(x){
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

Ship.prototype.moveLeft = function(){
	this.moveX(-this.speed);
}
Ship.prototype.moveRight = function(){
	this.moveX(this.speed);
}

Ship.prototype.moveY = function(y){
	this.rectangle.y += y;
};

Ship.prototype.getX = function(){
	return this.rectangle.x;
};

Ship.prototype.getY = function(){
	return this.rectangle.y;
};

Ship.prototype.getW = function(){
	return this.rectangle.w;
};

Ship.prototype.getH = function(){
	return this.rectangle.h;
};

Ship.prototype.asignBullet = function(b){
	this.bullet = b;
};

Ship.prototype.fire = function(){
	this.bullet.fire(this.getX() + this.getW() / 2,this.getY());
};

Ship.prototype.draw = function(ctx){
	ctx.fillStyle = this.color;
	ctx.fillRect(this.getX(),this.getY(),this.getW(),this.getH());
};

Ship.prototype.getState = function(){
	return {x:this.rectangle.x, y: this.rectangle.y};
}

Ship.prototype.setState = function(data) {
	this.rectangle.x = data.x;
	this.rectangle.y = data.y
}

module.exports = Ship;

