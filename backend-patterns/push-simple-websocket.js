const http = require("http");
const WebSocketServer = require("websocket").server;
let connections = []; //the users connecting to the websocket

//Here, an HTTP server is created using http.createServer(). This server will be used to establish a TCP connection, which will then be upgraded to a WebSocket connection
const httpserver = http.createServer();

//The WebSocket server is created using WebSocketServer from the "websocket" library, and it's configured to use the HTTP server previously created. 
//This allows the WebSocket server to handle WebSocket connections using the same port as the HTTP server.
const websocket = new WebSocketServer({"httpServer": httpserver});
//listening on the tcp socket on port 8080
httpserver.listen(8080, () => console.log("Server is listening on the port 8080..."));

//when a legit websocket request comes, it will listen to it and get the connection (only happens when a 'request' is received)
websocket.on("request", request => {

    //This line accepts the WebSocket connection and creates a connection object to interact with the connected client.
    const connection = request.accept(null, request.origin);
    connection.on("message", message => {
        const senderPort = connection.socket.remotePort;

        //someone just sent a msg, tell everybody (except the sender themselves)
        connections.forEach(c => {
            if(c.socket.remotePort !== senderPort){
                c.send(`User${connection.socket.remotePort} says:  ${message.utf8Data}`);
            }
        });
    });

    connections.push(connection);
    
    //someone just connected, tell everybody
    connections.forEach(c => c.send(`User on remoteport:${connection.socket.remotePort}, localport:${connection.socket.localPort} just connected`));
});




/*we can implement this client side code (via browser for example) to test the above websocket

//connecting to the server websocket
let ws = new WebSocket("ws://localhost:8080");

//code to print the messages whenever received
ws.onmessage = message => console.log(`Received: ${message.data}`);

//sending a message to the websocket
ws.send("Hello! I'm the client");
*/