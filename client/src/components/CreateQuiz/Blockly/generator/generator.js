import * as Blockly from "blockly/core";
import "blockly/javascript";

Blockly.JavaScript["question"] = function (block) {
  return `{
    "type": "multiple",  
    "question": "${block.getFieldValue("QUESTION")}", 
    "answers": [${Blockly.JavaScript.statementToCode(block, "ANSWERS")}],
    "time": ${Blockly.JavaScript.statementToCode(block, "TIME")}},`;
};

Blockly.JavaScript['answer'] = function (block) {
  return `{"content": "${block.getField('ANSWER').getText()}",
  "feedback": "${Blockly.JavaScript.statementToCode(block, "FEEDBACK")}",
  "isCorrect": ${block.getField('CORRECT').getText()}
  },`
};

Blockly.JavaScript["feedback"] = function (block) {
  return block.getField("FEEDBACK").getText();
}

Blockly.JavaScript["time"] = function (block) {
  return block.getField("TIME").getText() ?? null;
}

Blockly.JavaScript["question_single"] = function (block) {
  return `{"type": "single",
  "question": "${block.getFieldValue("SINGLE_QUESTION")}",
  "time": ${Blockly.JavaScript.statementToCode(block, "TIME")},
  "answers": [${Blockly.JavaScript.statementToCode(block, "ANSWERS")}]},`;
};

Blockly.JavaScript["question_true_false"] = function (block) {
  return `{
    "type": "truefalse",
    "question": "${block.getFieldValue("TRUE_FALSE_QUESTION")}",
    "time": ${Blockly.JavaScript.statementToCode(block, "TIME")},
    "feedback": "${Blockly.JavaScript.statementToCode(block, "FEEDBACK")}",
    "answers": [
      {"content": "Tiesa", "isCorrect": ${block
        .getField("POSITIVE")
        .getText()}, "feedback": ""},
      {"content": "Netiesa", "isCorrect": ${block
        .getField("POSITIVE")
        .getText() === 'true' ? false : true}, "feedback": ""}
    ]
  },`;
};
