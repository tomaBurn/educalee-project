import * as Blockly from "blockly/core";
import "../fields/BlocklyReactField";

var time = {
  type: "time",
  message0: "Laikas %1 sekundžių",
  args0: [
    {
      type: "field_input",
      name: "TIME",
    },
  ],
  colour: 120,
};

Blockly.Blocks["time"] = {
  init: function () {
    this.jsonInit(time);
    this.setOutput(true);
  },
};
