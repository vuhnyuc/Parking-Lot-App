var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');


//HOST and PORT vars
var HOST = '0.0.0.0';
var PORT = 8082;
var current_status = "000";

net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        sock.write('You said "' + data + '"');
        current_status = data.toString('utf8');
        io.emit('chat message', current_status);
        
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    
}).listen(PORT);

console.log('TCP listening on ' + HOST +':'+ PORT);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	io.emit('chat message', current_status);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(8081, function(){
  console.log('listening on *:3000');
});
