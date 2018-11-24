const fs = require("fs");
const path = require("path");

const separator = "////";

function write(path, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, JSON.stringify(data) + separator, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function read(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
}

function fromContentToObject(content) {
  console.log(content);
  const splittedContent = content.split(separator);
  return splittedContent
    .map(content => {
      try {
        const json = JSON.parse(content);
        return json;
      } catch (error) {
        return null;
      }
    })
    .filter(value => value !== null);
}

function handleError(socket) {
  return error => {
    const message = JSON.stringify({
      error: error.message,
      code: 500
    });
    socket.write(message);
    socket.end();
  };
}

module.exports = pathToDb => socket => ({
  create: model => {
    switch (model) {
      case "entry":
        return data => {
          write(path.resolve(pathToDb, data.collection), data.data)
            .then(() => {
              socket.write(
                JSON.stringify({
                  code: 200
                })
              );
            })
            .then(() => socket.end())
            .catch(err => {
              handleError(socket)(err);
            });
        };
      case "collection":
        return data => {
          write(path.resolve(pathToDb, data.collection), "")
            .then(() => {
              socket.write(
                JSON.stringify({
                  code: 200
                })
              );
            })
            .then(() => socket.end())
            .catch(err => {
              handleError(socket)(err);
            });
        };
    }
  },
  get: model => {
    switch (model) {
      case "entry":
        return data => {
          read(path.resolve(pathToDb, data.collection))
            .then(content => fromContentToObject(content))
            .then(result => {
              socket.write(
                JSON.stringify({
                  code: 200,
                  data: result
                })
              );
            })
            .then(() => socket.end())
            .catch(err => {
              handleError(socket)(err);
            });
        };
      case "collection":
        return data => {
          read(path.resolve(pathToDb, data.collection))
            .then(content => fromContentToObject(content))
            .then(result => {
              socket.write(
                JSON.stringify({
                  code: 200,
                  data: result
                })
              );
            })
            .then(() => socket.end())
            .catch(err => {
              handleError(socket)(err);
            });
        };
    }
  },
  handleError: handleError(socket)
});
