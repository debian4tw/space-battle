var GameOpts = require('./game_opts');
var Ship = require('./ship');
var Bullet = require('./bullet');
var Fleet = require('./fleet');
var Barrier = require('./barrier');
var Bonus = require('./bonus');


var SpaceBattle = function(sock){

    this.KEYCODE_LEFT = 37,
    this.KEYCODE_RIGHT = 39,
    this.KEYCODE_UP = 38,
    this.KEYCODE_DOWN = 40; 

    this.lastMessage = 0;
    this.commands = {};
    this.commands[0] = Date.now();

    this.socket = sock;
    this.actors = [];
    this.collisions = [];

    this.ship1 = new Ship(370,10,'#0BFFF5');
    this.ship2 = new Ship(370,500,'pink');

    this.b1 = new Bullet(-10,-10,'grey');
    this.b2 = new Bullet(-10,-10,'grey');
    this.b2.orientation = 1;

    this.ship1.asignBullet(this.b1);
    this.ship2.asignBullet(this.b2);

    this.fleet = new Fleet(240,200,'#AF90FF');

    this.b3 = new Bullet(-10,-10,'#AF90FF');
    this.b3.speed = 15;
    this.fleet.asignBullet(this.b3);

    this.bar1 = new Barrier(150, 70, '#35FFCF');
    this.bar2 = new Barrier(150, 430, '#35FFCF',true);

    this.bonus = new Bonus(10,140,'red');
    //this.actors.push(this.bonus);

    this.actors.push(this.ship1);
    this.actors.push(this.ship2);
    this.actors.push(this.b1);
    this.actors.push(this.b2);
    this.actors.push(this.fleet);
    this.actors.push(this.b3);
    this.actors.push(this.bar1);    
    this.actors.push(this.bar2);


    if(typeof window !== 'undefined'){
        this.owOgg = new Audio("/sounds/shot.ogg");
    }

    this.registerCollisions();
  
};


SpaceBattle.prototype.startFleet = function(){
    var that = this;
    setInterval(function(){
        that.moveFleet();
    },800);
    var handle=0;
    setInterval(function(){        
        clearInterval(handle);
        handle = setInterval(function(){
            if(that.bonus.direction == 0){
                that.bonus.moveX(that.bonus.speed);
            } else {
                that.bonus.moveX(-that.bonus.speed);
            }
        },50);

        if(that.bonus.direction == 0){
            that.bonus.direction =1;
        } else {
            that.bonus.direction = 0;
        }

    },8500);
};

SpaceBattle.prototype.moveFleet = function(){
    
    if (this.fleet.direction == 0) {
        if (this.fleet.rectangle[0].x < 420) {  
            this.fleet.moveX(this.fleet.speed * 2);
        }
        else {
            this.fleet.direction = 1;
        }
    } else {
        if (this.fleet.rectangle[0].x > 50) {
            this.fleet.moveX(-this.fleet.speed * 2);
        }
        else {
            this.fleet.direction = 0;
        }

    }

    this.fleet.fire();
};





SpaceBattle.prototype.draw = function(ctx){

    
    ctx.clearRect(0,0,800,600);
    /*
    ctx.fillStyle = 'white';
    ctx.font = "80px Arial";
    ctx.fillText("Space Battle",200,300);
    */
    for (i=0,l=this.actors.length;i<l;i++) {
        this.actors[i].draw(ctx);
    }
    //this.draw(ctx);
    /*var that = this;
    requestAnimFrame(function(){
        that.draw(ctx);
    });*/
};



SpaceBattle.prototype.handleMove = function(i) {
    var t;
    t = Date.now();
    if (this.left) { 
        //console.log('left ' + i);        
        this.socket.emit('moved',{t: t ,i:this.lastMessage,direction :'left'});
        this.commands[this.lastMessage] = t;
       // this.ship1.moveX(-this.ship1.speed);
       this.lastMessage++;
    } else if (this.right) {
        //console.log('right' + i);
        this.socket.emit('moved',{t: t, i:this.lastMessage,direction : 'right'});
        this.commands[this.lastMessage] = t;
       //this.ship1.moveX(this.ship1.speed);
       this.lastMessage++;
    }
   
    /* if (this.up) {
        this.ship1.moveY(-this.ship1.speed);
    } else if (this.down) {
        this.ship1.moveY(+this.ship1.speed);
    }*/
};

SpaceBattle.prototype.keyPressed = function keyPressed(event) {
    
    switch (event.keyCode) {
        case this.KEYCODE_LEFT:
            //console.log("left held");
            this.left = true;
            //this.socket.emit('moved',{direction :'left'});
            break;

        case this.KEYCODE_RIGHT:
            //console.log('right held');
            this.right = true;
            //this.socket.emit('moved',{direction : 'right'});
            break;
        /*
        case this.KEYCODE_UP:
            this.up = true;
        break;

        case this.KEYCODE_DOWN:
            this.down = true;
        break;
        */
        case 32:
            //console.log('fired event');
            //console.log(this.ship1.bullet.state);
            if (this.ship1.bullet.state == 0) {
                //console.log('fire emit');
                this.owOgg.play();
                this.socket.emit('fired',{});
            }            
            break;

    }

    event.preventDefault();
    event.stopPropagation();
};

SpaceBattle.prototype.keyUp  = function keyUp(event) {
    //console.log(event.keyCode);
    switch (event.keyCode) {
        case this.KEYCODE_LEFT:
            //console.log("left released");
            this.left = false;
            break;
        case this.KEYCODE_RIGHT:
            this.right = false;
            break;
        case this.KEYCODE_UP:
            this.up = false;
            break;
        case this.KEYCODE_DOWN:
            this.down = false;
            break;
    }
};

SpaceBattle.prototype.getState = function(){
    var r = [];
    var s;

    this.handleCollisions();

    for (var i = 0,il = this.actors.length; i < il; i++) {
        r.push(this.actors[i].getState());
    };
    return r;
};

SpaceBattle.prototype.setState = function(data){
    
    for (var i = 0,il = data.length; i < il; i++) {
        if(data[i] != null){
            //if(this.actors[i] != this.ship1){
                this.actors[i].setState(data[i]);
           // }
        }
    };
    //console.log(r);
};


SpaceBattle.prototype.check_collision = function(A,B) {
    //The sides of the rectangleangles
    var leftA, leftB,
    rightA, rightB,
    topA, topB,
    bottomA, bottomB;

    //Calculate the sides of rectangle A
    leftA = A.x;
    rightA = A.x + A.w;
    topA = A.y;
    bottomA = A.y + A.h;

    //Calculate the sides of rectangle B
    leftB = B.x;
    rightB = B.x + B.w;
    topB = B.y;
    bottomB = B.y + B.h;
    //Here we have the actual function that checks for a collision.

    //First thing the function does is take in the SDL_rectangles and calculate their sides.
    //If any of the sides from A are outside of B
    if (bottomA <= topB) {
        return false;
    }

    if (topA >= bottomB) {
        return false;
    }

    if (rightA <= leftB) {
        return false;
    }

    if (leftA >= rightB) {
        return false;
    }

    //If none of the sides from A are outside B
    return true;
};


SpaceBattle.prototype.registerCollisions = function(){

    var that = this;

    this.registerCollision(that.b1, that.bar1, function(i){
        that.bar1.active[i] = 0;
        that.b1.reset();
    });

    this.registerCollision(that.b1, that.bar2, function(i){
        that.bar2.active[i] = 0;
        that.b1.reset();
    });    
    this.registerCollision(that.b1, that.ship2, function(){
        that.b1.reset();
        that.ship2.rectangle.x=0;
    });

    this.registerCollision(that.b1, that.fleet, function(i){
        that.fleet.active[i] = 0;
        that.fleet.aliveShips--;
        that.b1.reset();
    });

    this.registerCollision(this.b2, this.ship1, function(){
        that.b2.reset();
        that.ship1.rectangle.x=0;
    });

    this.registerCollision(this.b2, this.fleet, function(i){
        that.fleet.active[i] = 0;
        that.fleet.aliveShips--;
        that.b2.reset();
    });    

    this.registerCollision(this.b2, this.bar1, function(i){
        that.bar1.active[i] = 0;
        that.b2.reset();
    });

    this.registerCollision(this.b2, this.bar2, function(i){
        that.bar2.active[i] = 0;
        that.b2.reset();
    });

    this.registerCollision(this.b3, this.ship1, function(){
        that.b3.reset();
        that.ship1.rectangle.x=0;
        //sb.addToLife1(-1);
    });
    this.registerCollision(this.b3, this.ship2, function(){
        that.b3.reset();
        that.ship2.rectangle.x=0;
        //sb.addToLife2(-1);
    });
    this.registerCollision(this.b3, this.bar2, function(i){
        that.bar2.active[i] = 0;
        that.b3.reset();
    });
    this.registerCollision(this.b3, this.bar1, function(i){
        that.bar1.active[i] = 0;
        that.b3.reset();
    });
 
};

SpaceBattle.prototype.registerCollision = function(a, b, cb){
    var self = this;
    this.collisions.push(function(){

        if(a.state != 1){
            return;
        }

        if(b.rectangle.constructor === Array){
            for (var i=0, j=b.rectangle.length; i<j; i++) {
                if (b.active[i] == 1 && self.check_collision(a.rectangle,b.rectangle[i])) {
                    cb(i);
                }
            }
        }else{
            if(self.check_collision(a.rectangle,b.rectangle)) {
                cb();
            }
        } 
    });

};

SpaceBattle.prototype.handleCollisions = function(){
   
    for(i=0; i<this.collisions.length; i++){
        this.collisions[i]();
    }

};


module.exports = SpaceBattle;

