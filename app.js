/**
 * Module dependencies.
 */
var express = require('express');
var exphbs  = require('express3-handlebars');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var app = express();
var config = require('./config');
var gameServer = require('./game_server');

var server;
var serv_io;


initAppServer();
gameServer.init(serv_io);


app.get('/', routes.index);
app.get('/game', routes.game);



function initAppServer(){

  app.set('port', config.port);

  app.set('views', path.join(__dirname, 'views'));

  app.engine('handlebars', exphbs({defaultLayout: 'main'}));  
  app.set('view engine', 'handlebars');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  server = http.createServer(app);
  serv_io = io.listen(server, {log: false });

  server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

};