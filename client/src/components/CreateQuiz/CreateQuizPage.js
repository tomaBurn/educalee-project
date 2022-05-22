import React from "react";
import { Button, Form, Row } from "reactstrap";
import { withRouter } from "react-router-dom";
import BlocklyComponent, { Block } from "./Blockly";
import BlocklyJS from "blockly/javascript";
import "./Blockly/blocks/MultipleChoice/answerBlock";
import "./Blockly/blocks/MultipleChoice/questionBlock";
import "./Blockly/blocks/TrueFalse/questionTrueFalseBlock";
import "./Blockly/blocks/SingleChoice/questionSingleBlock";
import "./Blockly/blocks/MultipleChoice/feedbackValue";
import "./Blockly/blocks/timeInputBlock";
import "./Blockly/generator/generator";
import "./CreateQuizPage.css";
import { axiosJWT } from "../../App.js";
import TextField from "@mui/material/TextField";

class CreateQuizPage extends React.Component {
  constructor() {
    super();
    this.simpleWorkspace = React.createRef();
    const query = new URLSearchParams(window.location.search);
    this.state = {
      topicId: query.get("topicId"),
      title: null,
      dueDate: null,
      dueTime: null,
      answers: [null],
      correctAnswers: [""],
      questions: [],
      reps: null,
    };
    this.onSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    var createdQuestionArray =
      "[" + BlocklyJS.workspaceToCode(this.simpleWorkspace.workspace) + "]";
    createdQuestionArray = createdQuestionArray.replace(
      /"time": },/g,
      '"time": 60 },'
    );
    createdQuestionArray = createdQuestionArray.replace(/},],/g, "}],");
    createdQuestionArray = createdQuestionArray.replace(/},]}/g, "}]}");
    createdQuestionArray = createdQuestionArray.replace(/]},]/g, "]}]");
    createdQuestionArray = createdQuestionArray.replace(/},]/g, "}]");
    createdQuestionArray = createdQuestionArray.replace(/},]/g, "}], ");
    createdQuestionArray = createdQuestionArray.replace(
      /"time": ,/g,
      '"time": 60,'
    );

    let isValid = true;
    const data = {
      title: this.state.title,
      dueDate: this.state.dueDate,
      dueTime: this.state.dueTime,
      questions: JSON.parse(createdQuestionArray),
    };

    if (data.questions.length === 0) {
      alert("Nėra klausimų");
      isValid = false;
    } else {
      data.questions.forEach((question) => {
        if (!question.type) {
          isValid = false;
          alert("Visi atsakymai turi priklausyti klausimui");
        } else if (
          question.type !== "truefalse" &&
          question.answers.length === 0
        ) {
          isValid = false;
          alert(`Klausimas "${question.question}" neturi jokių atsakymų`);
        } else if (question.type !== "truefalse") {
          let correctAnswers = question.answers.filter(
            (answer) => answer.isCorrect === true
          );
          if (correctAnswers.length === 0) {
            isValid = false;
            alert(
              `Klausimas "${question.question}" neturi nurodyto teisingo atsakymo.`
            );
          }
          if (question.type === "single" && correctAnswers.length > 1) {
            isValid = false;
            alert(
              `Klausimas "${question.question}" turi per daug teisingų atsakymų. Pasirinkite vieną arba naudokite kelių teisingų atsakymų bloką.`
            );
          }
        }
      });
    }

    if (isValid) {
      axiosJWT
        .post("/api/quizzes", {
          headers: { "x-access-token": localStorage.getItem("token") },
          topicId: this.state.topicId,
          quizTitle: this.state.title,
          dueDate: this.state.dueDate,
          dueTime: this.state.dueTime,
          questions: createdQuestionArray,
          reps: this.state.reps,
        })
        .then(() => this.props.history.push("/home"));
    }
  }

  render() {
    return (
      <div className="create-wrapper">
        <Form onSubmit={this.onSubmit}>
          <h3>Pridėti viktorinos tipo žaidimą</h3>
          <Row className="add-stud-row">
            <TextField
              label="Pavadinimas"
              variant="standard"
              onChange={(e) => this.setState({ title: e.target.value })}
              required
              sx={{ ml: 2, flex: 0.25 }}
            />
          </Row>
          <Row className="add-stud-row">
            <TextField
              label="Leistinas žaidimo atlikimų kiekis"
              variant="standard"
              onChange={(e) => this.setState({ reps: e.target.value })}
              sx={{ ml: 2, flex: 0.25 }}
            />
          </Row>
          <Button type="submit" className="create-quiz-btn">
            Pateikti
          </Button>
        </Form>
        <div className="create-holder">
          <BlocklyComponent
            ref={this.simpleWorkspace}
            readOnly={false}
            trashcan={true}
            media={"media/"}
            move={{
              scrollbars: {
                horizontal: false,
                vertical: false,
              },
              drag: true,
              wheel: true,
            }}
            initialXml={`
                <xml xmlns="http://www.w3.org/1999/xhtml">
                </xml>
              `}
          >
            <Block type="question" />
            <Block type="question_true_false" />
            <Block type="question_single" />
            <Block type="answer" />
            <Block type="feedback" />
            <Block type="time" />
          </BlocklyComponent>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateQuizPage);
