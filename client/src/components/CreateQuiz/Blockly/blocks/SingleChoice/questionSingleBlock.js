import * as Blockly from "blockly/core";
import "../../fields/BlocklyReactField";

var questionSingle = {
  type: "question_single",
  message0: "Vieno teisingo klausimas %1",
  args0: [
    {
      type: "field_input",
      name: "SINGLE_QUESTION",
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
  colour: 180,
};

Blockly.Blocks["question_single"] = {
  init: function () {
    this.jsonInit(questionSingle);
  },
};
