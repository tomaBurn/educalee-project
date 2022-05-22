import * as Blockly from "blockly/core";
import "../../fields/BlocklyReactField";

var feedback = {
  type: "feedback",
  message0: "Pranešimas %1",
  args0: [
    {
      type: "field_input",
      name: "FEEDBACK",
    },
  ],
  colour: 120,
};

Blockly.Blocks["feedback"] = {
  init: function () {
    this.jsonInit(feedback);
    this.setOutput(true);
  },
};