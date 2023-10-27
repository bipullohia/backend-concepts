const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("./todo.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPkg = grpcObj.todoPackage;

const client = new todoPkg.Todo("localhost:8090", grpc.credentials.createInsecure());

/*
    reads the function client wants as 2nd argument:
     - create (calls createTodo)
     - readArray (calls readTodos)
     - readStream (calls readTodosStream)
     anything else in the arg throws a invalid function error
*/
const argFunc = process.argv[2]; 

 //reads the tasks from the terminal in case of createTodo call as 3rd argument
const argText = process.argv[3];


if(argFunc === 'create'){
    //the RPC to create a new item in the Todos
    if(argText){
        client.createTodo({
            "id": -1,
            "text": argText
        }, (err, resp) => {
            console.log("Received the resp from server for creating a new item: " + JSON.stringify(resp));
        });    
    }else{
        console.log("Please insert the Todo item as 3rd argument correctly after create")
    }
    
}else if(argFunc === 'readArray'){
    //this RPC is returning all the TODOs items in the array at once (not really a pleasant way)
    client.readTodos(null, (err, resp) => {
        if(resp.items){
            console.log(`Received from server ${resp.items.length} items:`)
            resp.items.forEach(item => {
                console.log(item.text);
            });
        }
    });

}else if(argFunc === 'readStream'){
    //consuming the stream RPC to get all the items as stream instead of everything at once
    const call = client.readTodosStream();
    //this will process each stream of data sent for the above RPC call
    call.on("data", item => {
        console.log("Received item as a stream from server: " + JSON.stringify(item));
    });
    //this will be called when the server is done sending streams of data (have to set this in server)
    call.on("end", resp => console.log("server done!!"));

}else{
    console.log("Invalid function argument");
}

/*Execution in terminal (for my forgetful and lazy brain):
    - node client.js create walk
    - node client.js readArray
    - node client.js readStream
*/