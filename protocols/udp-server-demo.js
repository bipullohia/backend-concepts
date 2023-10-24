const dgram = require("dgram");

const socket = dgram.createSocket("udp4");
socket.bind(5500, "127.0.0.1");

socket.on("message", (msg, info) => {
    console.log(`Server got a datagram: ${msg}, from: ${info.address}:${info.port}`);
});

/*
    After running this udp server, we can send a message to it using netcat command (nc) like:
    nc -u 127.0.0.1 5500 
    After pressing enter, type the msg you want to send

    nc -> netcat
    -u -> udp
    ip
    port
*/