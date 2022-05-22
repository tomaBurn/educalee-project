import * as Blockly from "blockly/core";
import "../../fields/BlocklyReactField";

var question = {
  type: "question",
  message0: "Kelių teisingų atsakymų klausimas %1",
  args0: [
    {
      type: "field_input",
      name: "QUESTION",
    },
  ],
  message1: "Atsakymai %1",
  args1: [
    {
      type: "input_statement",
      name: "ANSWERS",
    },
  ],
  message2: "Skirtas klausimui laikas %1",
  args2: [
    {
      type: "input_value",
      name: "TIME",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 360,
};

Blockly.Blocks["question"] = {
  init: function () {
    this.jsonInit(question);
  },
};
