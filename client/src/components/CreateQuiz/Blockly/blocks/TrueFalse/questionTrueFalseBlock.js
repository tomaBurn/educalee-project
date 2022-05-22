import * as Blockly from "blockly/core";
import "../../fields/BlocklyReactField";

var questionTrueFalse = {
  type: "question_true_false",
  message0: "Tiesa / netiesa klausimas %1",
  args0: [
    {
      type: "field_input",
      name: "TRUE_FALSE_QUESTION",
    },
  ],
  message1: "Teiginys teisingas? %1",
  args1: [
    {
      type: "field_checkbox",
      name: "POSITIVE",
      checked: false,
    },
  ],
  message2: "Pranešimas  %1",
  args2: [
    {
      type: "input_value",
      name: "FEEDBACK",
    },
  ],
  message3: "Skirtas klausimui laikas %1",
  args3: [
    {
      type: "input_value",
      name: "TIME",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 270,
};

Blockly.Blocks["question_true_false"] = {
  init: function () {
    this.jsonInit(questionTrueFalse);
  },
};
