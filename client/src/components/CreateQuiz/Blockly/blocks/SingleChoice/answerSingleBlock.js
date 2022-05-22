import * as Blockly from "blockly/core";
import "../../fields/BlocklyReactField";

var answerSingle = {
  type: "answer_single",
  message0: "Klausimas %1",
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
  previousStatement: null,
  nextStatement: null,
  colour: 180,
};

Blockly.Blocks["answer_single"] = {
  init: function () {
    this.jsonInit(answerSingle);
  },
};
