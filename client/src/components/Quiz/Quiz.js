import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "./QuizPage";

function Quiz(props) {
  return (
    <div className="container" component="div" key={props.questionId}>
      <h3>{props.question.title}</h3>
      <div className="questionCount">
        <span>{props.questionId}</span> klausimas iš{" "}
        <span>{props.questionTotal}</span>
      </div>
      <h3>{props.question.question}</h3>
      <ul className="answerOptions">
        {props.question.answers.map((option, index) => {
          let backgroundColor = "";
          const answerContainsOption = props.answer.some(
            (answer) => answer === option.content
          );
          if (option.isCorrect && props.answerSubmitted && answerContainsOption)
            backgroundColor = "rgb(171, 244, 171)";
          else if (
            !option.isCorrect &&
            props.answerSubmitted &&
            answerContainsOption
          )
            backgroundColor = "#ff7e7e";
          return (
            <li
              className="answerOption"
              key={index}
              style={{ background: backgroundColor }}
            >
              <label className="radioCustomLabel" htmlFor={props.answerType}>
                <input
                  disabled={props.answerSubmitted}
                  type={
                    props.question.type === "multiple" ? "checkbox" : "radio"
                  }
                  name="radioGroup"
                  id={props.answerType}
                  value={option.content}
                  onChange={props.onAnswerSelected}
                  style={{ marginRight: 16 }}
                />
                {option.content}
              </label>
            </li>
          );
        })}
        {props.color && props.showFeedback()}
        <div className="quiz-grid">
          {!props.answerSubmitted ? (
            <Button onClick={props.checkAnswer} className="quiz-check-ans">
              Patikrinti atsakymą
            </Button>
          ) : (
            <Button onClick={props.nextQuestion} className="quiz-next">
              Sekantis klausimas
            </Button>
          )}
          <div className="quiz-counter">
            <CountdownCircleTimer
              isPlaying={!props.answerSubmitted}
              duration={props.time}
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[7, 5, 2, 0]}
              size={30}
              strokeWidth={4}
              onComplete={() => props.checkAnswer()}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          </div>
        </div>
      </ul>
    </div>
  );
}

Quiz.propTypes = {
  answer: PropTypes.array.isRequired,
  question: PropTypes.object.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  showFeedback: PropTypes.func.isRequired,
  answerSubmitted: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
};

export default Quiz;
