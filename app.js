var express=require('express');
var app=express();
var http=require('http');
var server=http.createServer(app);

var io=require('socket.io').listen(server);

var conMembers=[];

app.use(express.static(__dirname+'/root'));

app.get('/', function(req, res){
    res.sendfile('./root/Index.html');
});

io.sockets.on('connection',function(socket){
	socket.emit("message",{from:"Server",content:"<b>Welcome!</b> You are connected"});
	socket.on('addMember',function(un){
		socket.un=un;
		conMembers.push(un);
		console.log(socket.un+" is connected")
		socket.broadcast.emit('message',{from:"Server",content:socket.un+" is just Join!"});
		io.sockets.emit("memberjoin",conMembers);
	});
	
	
	socket.on('addImage',function(image){
		io.sockets.emit('sendImage',socket.un,image)
	});
	
	socket.on('chat',function(data){
		io.sockets.emit('message',{from:socket.un,content:data})
	});
	
	socket.on('disconnect',function(){
		var i=conMembers.indexOf(socket.un);
		conMembers.splice(i,1);
		console.log(socket.un+" has left!");
		socket.broadcast.emit('message',{from:"Server",content:socket.un+" is just Left!"});
		io.sockets.emit("memberjoin",conMembers);
	});
});
var port=2020;
server.listen(port);
console.log("Server is running at > http://localhost:"+port);