import React, { Component } from "react";
import Quiz from "./Quiz";
import { axiosJWT } from "../../App.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import Result from "./Result";

import "./QuizPage.css";

class QuizPage extends Component {
  constructor(props) {
    super(props);
    const query = new URLSearchParams(window.location.search);

    this.state = {
      id: query.get("id"),
      topicId: query.get("topic"),
      questions: null,
      quizName: "",
      counter: 0,
      questionId: 1,
      question: "",
      answer: [],
      answersCount: {},
      correctAnswerCount: 0,
      result: "",
      loading: true,
      color: "",
      answerSubmitted: false,
      time: 60,
      userTotalScore: null,
    };

    this.onAnswerSelected = this.onAnswerSelected.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.renderQuiz = this.renderQuiz.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.showFeedback = this.showFeedback.bind(this);
  }

  componentDidMount() {
    axiosJWT
      .post(`/api/get-quiz`, {
        headers: { "x-access-token": localStorage.getItem("token") },
        quizId: this.state.id,
      })
      .then((response) => {
        const quiz = response.data[0];
        const questions = quiz.questions;
        this.setState({
          quizName: quiz.quiz_title,
          questions: questions,
          question: questions[0],
          time: questions[0].time,
          loading: false,
        });
      });
  }

  onAnswerSelected(event) {
    if (this.state.question.type === "multiple") {
      if (this.state.answer.some((ans) => ans === event.currentTarget.value)) {
        const index = this.state.answer.indexOf(event.currentTarget.value);
        this.state.answer.splice(index, 1);
      } else {
        let newAnswer = [...this.state.answer, event.currentTarget.value];
        this.setState({ answer: newAnswer });
      }
    } else if (
      this.state.question.type === "truefalse" ||
      this.state.question.type === "single"
    ) {
      this.setState({ answer: [event.currentTarget.value] });
    }
  }

  getCorrectAnswers() {
    return this.state.question.answers
      .filter((answer) => answer.isCorrect === true)
      .map((answer) => answer.content);
  }

  checkIfAnswerIsCorrect() {
    return this.getCorrectAnswers().sort().join(",") ===
      this.state.answer.sort().join(",")
      ? true
      : false;
  }

  checkAnswer() {
    this.setState({ answerSubmitted: true });
    if (this.checkIfAnswerIsCorrect()) {
      this.setState({
        correctAnswerCount: this.state.correctAnswerCount + 1,
        color: "#abf4ab",
      });
    } else this.setState({ color: "#ff7e7e" });
  }

  calculateResults() {
    let answers = this.getCorrectAnswers();
    let result = 0;
    answers.forEach((answer) => {
      if (!!this.state.answer.find((ans) => ans === answer)) result++;
    });
    return result;
  }

  getFeedbackMessages() {
    let messages = [];

    if (this.state.question.type === "truefalse") {
      messages = [this.state.question.feedback];
    } else
      this.state.answer.forEach((answer) => {
        messages.push(
          this.state.question.answers.find((ans) => ans.content === answer)
            .feedback
        );
      });

    return messages;
  }

  showFeedback() {
    let messages = this.getFeedbackMessages();
    let answers = this.getCorrectAnswers();
    let isCorrect = this.checkIfAnswerIsCorrect();

    return (
      <div>
        <div className="quiz-wrapper">
          {isCorrect && (
            <div
              className="quiz-holder"
              style={{
                background: "#abf4ab",
              }}
            >
              <h5 className="header-fdb">Teisignai!</h5>
              {messages.map((message, index) => {
                return (
                  <h6 className="header-fdb" key={index}>
                    {message}
                  </h6>
                );
              })}
            </div>
          )}
        </div>
        <div className="quiz-wrapper">
          {!isCorrect && (
            <div
              className="quiz-holder"
              style={{
                background: "#e5e5e5",
              }}
            >
              <h5 className="header-fdb">Teisingas atsakymas</h5>
              {answers.map((answer, index) => {
                return <h6 className="header-fdb">{answer}</h6>;
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  nextQuestion() {
    this.setState({ color: "", answerSubmitted: false });

    this.setState({}, () => {
      if (this.state.questionId < this.state.questions.length) {
        this.setNextQuestion();
      } else {
        this.getResults();
      }
    });
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: this.state.questions[counter],
      time: this.state.questions[counter].time,
      answer: [],
    });
  }

  getResults() {
    this.setState({
      result:
        this.state.correctAnswerCount + " iš " + this.state.questions.length,
    });
  }

  setResults(result) {
    this.setState({ result: result[0] });
  }

  renderResult() {
    return (
      <Result
        id={this.state.id}
        quizId={this.state.quizId}
        topicId={this.state.topicId}
        correntAnswerCount={this.state.correctAnswerCount}
        questionsLength={this.state.questions.length}
        result={this.state.result}
      />
    );
  }
  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={this.state.questions.length}
        onAnswerSelected={this.onAnswerSelected}
        checkAnswer={this.checkAnswer}
        nextQuestion={this.nextQuestion}
        color={this.state.color}
        showFeedback={this.showFeedback}
        answerSubmitted={this.state.answerSubmitted}
        time={this.state.time}
      />
    );
  }

  render() {
    if (this.state.loading) {
      return <div>loading</div>;
    }

    return (
      <div className="quiz-count">
        <div className="quiz-header">
          <h2>{this.state.quizName}</h2>
        </div>
        {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
  };
};

export default compose(withRouter, connect(mapStateToProps, null))(QuizPage);
