const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./todo.proto";
const loaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions);
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPkg = grpcObj.todoPackage;

const server = new grpc.Server();
server.bindAsync(
    "127.0.0.1:8090", 
    grpc.ServerCredentials.createInsecure(), 
    (error, port) => {
        console.log("Server running at http://127.0.0.1:8090");
        server.start();
    }
);

server.addService(todoPkg.Todo.service, 
    {
        "createTodo": createTodoFunc,
        "readTodos": readTodosFunc,
        "readTodosStream": readTodosStreamFunc
    });

//list of items stored here
const todos = [];

//func to create a new item in the Todos, and adding an id based on array length
function createTodoFunc(call, callback){
    console.log("request received from client: :" + JSON.stringify(call.request));
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem);
    callback(null, todoItem);
}

//this sends back the entire array of Todos at once, which might be overwhelming for the client to consume
function readTodosFunc(call, callback){
    callback(null, {
        "items": todos 
    })
}

//This will send back the Todo items as a stream (1 at a time) making it easy for client to consume
function readTodosStreamFunc(call, callback){
    todos.forEach(item => {
        call.write(item);
    });
    call.end();
}