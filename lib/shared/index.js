function getNodeField(node, kind, field, RED, msg) {
  switch (kind) {
    case "flow": {
      return node.context().flow.get(field);
    }
    case "global": {
      return node.context().global.get(field);
    }
    case "num": {
      return parseInt(field, 10);
    }
    case "msg": {
      return RED.util.getMessageProperty(msg, field);
    }
    case "bool": {
      return JSON.parse(field);
    }
    default: {
      return field;
    }
  }
}

module.exports = {
  getNodeField
};
