/* eslint-disable import/no-extraneous-dependencies */

const FlowDrawer = require("node-red-flow-drawer");
const { getNodeField } = require("./shared");

// TODO:
// Optional settings (here are defaults)
const SETTINGS = {
  httpNodeRoot: "/", // Root for http nodes
  userDir: process.cwd() // A directory with extenal node installations
};

module.exports = RED => {
  function myNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.flows = config.flows || "payload";
    node.flowsType = config.flowsType || "msg";
    node.on("input", async msg => {
      const msgResponse = [null, null];
      let error = false;
      try {
        const flows = getNodeField(node, node.flowsType, node.flows, RED, msg);
        const flowDrawer = new FlowDrawer(flows);
        const images = await flowDrawer.draw("svg");
        msg.payload = images.reduce((items, item) => {
          const [, data] = item.split("base64,");
          items.push(new Buffer(data, "base64"));
          return items;
        }, []);
        msgResponse[0] = msg;
      } catch (err) {
        error = true;
        console.error(err);
        node.error(err.message);
        msg.payload = {
          message: err.message
        };
        msgResponse[1] = msg;
      } finally {
        node.status({
          fill: !error ? "green" : "red",
          shape: "dot",
          text: `Finished request with Error: ${error}`
        });
        node.send(msgResponse);
      }
    });
  }
  RED.nodes.registerType("flowDrawer", myNode);
};
