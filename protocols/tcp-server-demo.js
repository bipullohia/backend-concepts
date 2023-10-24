const net = require("net");

const server = net.createServer(socket => {
    //the execution reaches here only after the tcp handshake is done

    console.log("TCP handshake success with " + socket.remoteAddress + ":" + socket.remotePort);
    socket.write("Hello client, this is the server speaking!!");

    //executes when a data is received by the other side/ client
    socket.on("data", data => {
        console.log("Received data: " + data.toString());
    })
})

server.listen(8090, "127.0.0.1");

/*
    After running this tcp server, we can send a message to it using netcat command (nc) like:
    nc 127.0.0.1 8090 
    After pressing enter, type the msg you want to send (you'll receive a message from server too)

    nc -> netcat
    ip
    port

    since tcp is the default way of connecting, we don't need to add anything like we did -u for udp
*/