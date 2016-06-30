
/**
 * Module dependencies.
 */
 var express = require('express')
 , routes = require('./routes')
 , user = require('./routes/user')
 , http = require('http')
 , path = require('path')
 , connect = require('connect')
 , sharejs = require('share').server;

 var app = express(),
 cookieParser = express.cookieParser('your secret here'),
 sessionStore = new connect.middleware.session.MemoryStore();

 app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(cookieParser);
  app.use(express.session({
    store: sessionStore
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

 app.configure('development', function(){
  app.use(express.errorHandler());
});

 app.get('/', function(req, res) {
   res.redirect('/index.html');
 });
 app.get('/users', user.list);

 var server = http.createServer(app),
 io = require('socket.io').listen(server);

 var SessionSockets = require('session.socket.io'),
 sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

 io.enable('browser client minification');
// send minified client
io.enable('browser client etag');
// apply etag caching logic based on version number
io.enable('browser client gzip');
// gzip the file
io.set('log level', 1);
// reduce logging

// enable all transports (optional if you want flashsocket support, please note that some hosting
// providers do not allow you to create servers that listen on a port different than 80 or their
// default port)
io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

sessionSockets.on('connection', function(err, socket, session) {
  socket.on('drawClick', function(data) {
    socket.broadcast.emit('draw', {
      x: data.x,
      y: data.y,
      type: data.type
    });
  });

  socket.on('drawCanvas', function(data) {
    socket.broadcast.emit('drawData', data);
  });
});

var options = {
  db: {type: 'none'},
  browserChannel: {cors: '*'},
  auth: function(client, action) {
    // This auth handler rejects any ops bound for docs starting with 'readonly'.
    if (action.name === 'submit op' && action.docName.match(/^readonly/)) {
      action.reject();
    } else {
      action.accept();
    }
  }
};

sharejs.attach(app, options);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
