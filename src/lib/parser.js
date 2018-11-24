module.exports = operator => ({
  parseToAction: (operationString, socket) => {
    let operations = operator(socket);
    try {
      const jsonOp = JSON.parse(operationString);
      const actor = jsonOp.action;
      const query = jsonOp.query;
      // action tipo action: create.entry oppure create.collection
      const [action, model] = actor.split(".");
      switch (action) {
        case "create":
          operations.create(model)(query);
          break;
        case "update":
          operations.update(model)(query);
          break;
        case "get":
          operations.get(model)(query);
          break;
        case "delete":
          operations.delete(model)(query);
          break;
      }
    } catch (error) {
      operations.handleError(error);
    }
    delete operations;
  },
  errorOnConnection: (error, socket) => {
    let operations = operator(socket);
    operations.handleError(error);
    console.log(error);
  }
});
