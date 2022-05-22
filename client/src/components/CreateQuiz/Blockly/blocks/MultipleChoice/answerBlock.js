import * as Blockly from "blockly/core";
import "../../fields/BlocklyReactField";

var answer = {
  type: "answer",
  message0: "Atsakymas %1",
  args0: [
    {
      type: "field_input",
      name: "ANSWER",
    },
  ],
  message1: "Atsakymas teisingas: %1",
  args1: [
    {
      type: "field_checkbox",
      name: "CORRECT",
      checked: false,
    },
  ],
  message2: "Pranešimas pasirinkus %1",
  args2: [
    {
      type: "input_value",
      name: "FEEDBACK",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 360,
};

Blockly.Blocks["answer"] = {
  init: function () {
    this.jsonInit(answer);
    this.setStyle("loop_blocks");
  },
};
