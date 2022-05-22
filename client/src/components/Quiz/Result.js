import React from "react";
import { axiosJWT } from "../../App.js";
import { connect } from "react-redux";
import { Button, Row } from "reactstrap";
import { withRouter } from "react-router-dom";
import { compose } from "redux";

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser.isTeacher === "N") {
      axiosJWT
        .post("/api/save_results", {
          headers: { "x-access-token": localStorage.getItem("token") },
          userId: currentUser.id,
          quizId: this.props.id,
          topicId: this.props.topicId,
          score: this.props.correntAnswerCount,
          totalScore: this.props.questionsLength,
        })
        .then(() => {
          this.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) return <div>loading</div>;
    return (
      <div style={{ width: 300 }}>
        <Row>
          <span>
            Teisingai išsprendei <strong>{this.props.result}</strong> klausimų!
          </span>
        </Row>
        <Row>
          <Button
            style={{ marginTop: 32 }}
            onClick={() => {
              if (this.props.currentUser.isTeacher === "Y")
                this.props.history.push("/home");
              else this.props.history.push("/stud-home");
            }}
          >
            Grįžti į pradinį puslapį
          </Button>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
  };
};

export default compose(withRouter, connect(mapStateToProps, null))(Result);
