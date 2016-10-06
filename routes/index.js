
/*
 * GET home page.
 */
 
var config = require('../config');
//var config = new conf();

exports.index = function(req, res){
  res.render('index', { title: 'Express', rand : Math.floor((Math.random()*100000)+1),baseUrl: config.baseUrl, jsUrl: config.jsUrl}
  );
};


exports.game = function(req, res){ 
  //console.log(req.query.id);
    if(!req.query.id){
      console.log('no game id');
      res.render('game-invalid');
    }
    res.render('game', { title: 'Game', baseUrl: config.baseUrl, jsUrl: config.jsUrl });
};
