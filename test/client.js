const net = require("net");

const socket = new net.Socket();

socket.connect({ port: 12045, host: "127.0.0.1" });

socket.on("error", err => {
  console.log(err);
});

socket.on("connect", () => {
  /*
  socket.write(
    JSON.stringify({
      action: "create.collection",
      query: {
        collection: "fluffyCollection"
      }
    })
  );
  socket.write("END");
  socket.write(
    JSON.stringify({
      action: "create.entry",
      query: {
        collection: "fluffyCollection",
        data: {
          gino: 12,
          magzia: ["logs", "morgs"]
        }
      }
    })
  );
  socket.write("END");
  socket.on("data", data => {
    console.log(data.toString());
  });
  */
  socket.write(
    JSON.stringify({
      action: "get.entry",
      query: {
        collection: "fluffyCollection"
      }
    })
  );
  socket.write("END");
  socket.on("data", data => {
    console.log(data.toString());
  });
});
