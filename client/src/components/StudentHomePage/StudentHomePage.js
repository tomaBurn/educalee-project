import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { axiosJWT } from "../../App.js";
import StarIcon from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import Divider from "@mui/material/Divider";
import "./StudentHomePage.css";

class StudentHomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      topics: [],
      quizzes: null,
      user: null,
      loadingUser: true,
      loadingTopics: true,
      loadingResults: true,
      results: null,
      level: null,
      userScore: null,
    };
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.setState({ user: currentUser });

    axiosJWT
      .post("/api/topics", {
        headers: { "x-access-token": localStorage.getItem("token") },
        teacherId: currentUser.teacherId,
      })
      .then((response) => {
        // var responseTopics = [];

        if (response.data) {
          var responseTopics = response.data.reduce(function (result, resp) {
            result[resp.topic_id] = result[resp.topic_id] || [];
            result[resp.topic_id].push(resp);
            return result;
          }, []);
        }

        this.setState({ topics: responseTopics, loadingTopics: false });
        axiosJWT
          .post(`/api/results`, {
            headers: { "x-access-token": localStorage.getItem("token") },
            id: currentUser.id,
          })
          .then((res) => {
            this.setState({ results: res.data, loadingResults: false });
            this.getUserLevel(res.data, response.data);
          });
      });

    axiosJWT
      .post("/api/user-score", {
        headers: { "x-access-token": localStorage.getItem("token") },
        userId: currentUser.id,
      })
      .then((response) => this.setState({ userScore: response.data.score }));
  }

  getUserLevel(results, topics) {
    var level = 1;
    const unique = [...new Set(results.map((item) => item.topic_id))];

    for (let i = 0; i < unique.length; i++) {
      const result = results.filter((o) => o.topic_id === unique[i]);

      let questions = 0;

      for (let j = 0; j < topics.length; j++) {
        if (topics[j].topic_id === unique[i]) questions++;
      }

      if (result.length === questions) level++;
    }

    this.setState({ level: level });
  }

  getAllowedReps(topic) {
    const allowedReps = topic.reps;

    if (allowedReps) {
      const result = this.state.results.find(
        (res) => res.quiz_id === topic.quiz_id
      );
      let userReps = result ? result.reps : 0;

      if (allowedReps <= userReps) {
        return { limitReached: true, status: `Išnaudojai visus bandymus` };
      } else {
        return {
          limitReached: false,
          status: `Liko ${allowedReps - userReps} bandymai iš ${allowedReps}`,
        };
      }
    } else {
      return { limitReached: false, status: "" };
    }
  }

  filledStar() {
    return (
      <StarIcon sx={{ color: "#ffc83d" }} stroke={"black"} strokeWidth={1} />
    );
  }

  showScore(quiz_id) {
    const result = this.state.results.find((o) => o.quiz_id === quiz_id);
    let totalScore = result.total_score;
    let score = result.score;
    let index = totalScore / 3;

    if (score < index)
      return (
        <div className="rating-col">
          <StarBorder />
          <StarBorder />
          <StarBorder />
        </div>
      );
    else if (index < score && index * 2 > score)
      return (
        <div className="rating-col">
          {this.filledStar()}
          <StarBorder />
          <StarBorder />
        </div>
      );
    else if (index * 2 < score && totalScore > score)
      return (
        <div className="rating-col">
          {this.filledStar()}
          {this.filledStar()}
          <StarBorder />
        </div>
      );
    else {
      return (
        <div className="rating-col">
          {this.filledStar()}
          {this.filledStar()}
          {this.filledStar()}
        </div>
      );
    }
  }

  getTopics() {
    if (this.state.loadingTopics || this.state.loadingResults) {
      return null;
    }
    return (
      <div>
        <div>Labas, {this.state.user.username}!</div>
        <div className="level-text">Tu esi {this.state.level} lygyje.</div>
        <div>
          Surinkti taškai: {/*this.state.user.score*/ this.state.userScore ?? 0}
        </div>
        {this.state.topics.map((item) => {
          const canPlayLevel = this.state.level >= item[0].level;
          return (
            <div
              className="level-box"
              style={{
                background: canPlayLevel ? "#b6dede" : "#e0e0e0",
              }}
            >
              <div className="level-header">
                <h5>
                  {item[0].level} lygis. {item[0].title}
                </h5>
              </div>

              <div className="stud-home-grid">
                {item.map((topic) => {
                  if (canPlayLevel) {
                    const reps = this.getAllowedReps(topic);
                    return (
                      <>
                        <div className="quiz-link">
                          {reps.limitReached ? (
                            <h6>{topic.quiz_title}</h6>
                          ) : (
                            <Link
                              to={`quiz?topic=${topic.topic_id}&id=${topic.quiz_id}`}
                            >
                              {topic.quiz_title}
                            </Link>
                          )}
                        </div>
                        {this.state.results.find(
                          (o) => o.quiz_id === topic.quiz_id
                        ) && this.showScore(topic.quiz_id)}
                        <div className="quiz-rating">
                          <h6>{reps.status}</h6>
                        </div>
                        <Divider className="stud-home-divider" />
                      </>
                    );
                  } else return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="std-home-wrapper">
        <div className="stud-topic-holder">{this.getTopics()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
  };
};

export default connect(mapStateToProps, null)(StudentHomePage);
