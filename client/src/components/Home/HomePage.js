import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { Row, Button, Container } from "reactstrap";
import { connect } from "react-redux";
import Divider from "@mui/material/Divider";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { axiosJWT } from "../../App.js";
import { withSnackbar } from "../SnackbarHOC";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import "./HomePage.css";

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      topics: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.loadTopics();
  }

  loadTopics() {
    axiosJWT
      .post("/api/topics", {
        headers: { "x-access-token": localStorage.getItem("token") },
        teacherId: this.props.currentUser.id,
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

        this.setState({ topics: responseTopics, loading: false });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          this.props.history.push("/");
          this.props.snackbarShowMessage(`Pasibaigė sesija`, "error");
        } else {
          this.props.snackbarShowMessage(`Įvyko klaida`, "error");
        }
      });
  }

  async deleteTopic(topicId) {
    confirmAlert({
      title: "Ištrini lygį",
      message: "Ar tikrai norite ištrinti šį lygį?",
      buttons: [
        {
          label: "Taip",
          onClick: () =>
            axiosJWT
              .post(`/api/delete-topic`, {
                headers: { "x-access-token": localStorage.getItem("token") },
                topicId: topicId,
              })
              .then((response) => {
                if (response.status === 200) {
                  this.loadTopics();
                  this.props.snackbarShowMessage(`Lygis ištrintas`, "success");
                } else {
                  this.props.snackbarShowMessage(`Įvyko klaida`, "error");
                }
              })
              .catch((error) =>
                this.props.snackbarShowMessage(`Įvyko klaida`, "error")
              ),
        },
        {
          label: "Ne",
        },
      ],
    });
  }

  deleteQuiz(quizId) {
    confirmAlert({
      title: "Ištrini užduotį",
      message: "Ar tikrai norite ištrinti šią užduotį?",
      buttons: [
        {
          label: "Taip",
          onClick: () =>
            axiosJWT
              .post(`/api/delete-quiz`, {
                headers: { "x-access-token": localStorage.getItem("token") },
                quizId: quizId,
              })
              .then((response) => {
                if (response.status === 200) {
                  this.loadTopics();
                  this.props.snackbarShowMessage(
                    `Užduotis ištrinta`,
                    "success"
                  );
                }
              })
              .catch((error) =>
                this.props.snackbarShowMessage(`Įvyko klaida`, "error")
              ),
        },
        {
          label: "Ne",
        },
      ],
    });
  }

  getTopics() {
    if (this.state.loading) {
      return null;
    }
    return (
      <div>
        {this.state.topics.map((item) => {
          return (
            <div className="grid" key={item[0].topic_id}>
              <>
                <h3 className="level-header">
                  {item[0].level} lygis. {item[0].title}
                </h3>
                <div className="add-quiz">
                  <Button
                    outline
                    color="secondary"
                    className="add-button"
                    onClick={() => this.deleteTopic(item[0].topic_id)}
                  >
                    Pašalinti
                  </Button>
                  <Link to={`create-quiz?topicId=${item[0].topic_id}`}>
                    <Button>Pridėti užduotį</Button>
                  </Link>
                </div>
              </>

              {item.map((topic) => {
                return (
                  <React.Fragment key={topic.quiz_id}>
                    {topic.quiz_id === null ? null : (
                      <>
                        <div className="quiz-row">
                          <Link
                            to={`quiz?id=${topic.quiz_id}&topic=${topic.topic_id}`}
                          >
                            {topic.quiz_title}
                          </Link>
                        </div>
                        <div className="del-button">
                          <Button
                            outline
                            color="secondary"
                            onClick={() => this.deleteQuiz(topic.quiz_id)}
                            style={{ marginRight: 8 }}
                          >
                            Pašalinti
                          </Button>

                          <Link to={`quiz-results?quizId=${topic.quiz_id}`}>
                            <Button outline color="secondary">
                              Rezultatai
                            </Button>
                          </Link>
                        </div>
                        <Divider style={{ gridColumn: "1 / span 3" }} />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return this.state.loading ? null : (
      <Container>
        <div className="holder">
          {!this.props.currentUser.isTeacher ? null : (
            <Row>
              <Link to={`add-topic`}>
                <Button>Pridėti naują lygį</Button>
              </Link>
            </Row>
          )}
          {this.getTopics()}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
  };
};

export default compose(
  withRouter,
  withSnackbar,
  connect(mapStateToProps, null)
)(HomePage);
