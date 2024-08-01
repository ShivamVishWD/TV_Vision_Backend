const eventEmitter = require("./Events");

eventEmitter.on("refresh-images", (data) => {
    console.log("refresh-images data : ",data)
    // socket.emit("refresh-data", data);
})