import React from "react";
import { connect } from "react-redux";
import { axiosJWT } from "../../App.js";
import { Button, Container } from "reactstrap";
import CustomPaginationActionsTable from "./Table";
import { withRouter } from "react-router-dom";
import { compose } from "redux";

class ResultsPage extends React.Component {
  constructor() {
    super();
    const query = new URLSearchParams(window.location.search);
    this.state = {
      quizId: query.get("quizId"),
      list: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    axiosJWT
      .post("/api/quiz-results", {
        headers: { "x-access-token": localStorage.getItem("token") },
        quizId: this.state.quizId,
      })
      .then((response) => {
        this.setState({ list: response.data, isLoading: false });
      });
  }

  render() {
    if (this.state.isLoading) return <div>loading</div>;
    return (
      <Container>
        <div style={{ padding: 32 }}>
          <div style={{ paddingBottom: 16 }}>
            <h3>Rezultatai</h3>
          </div>
          <CustomPaginationActionsTable
            studentId={null}
            students={this.state.list}
          />
          <Button
            outline
            color="secondary"
            style={{ marginTop: 16 }}
            onClick={() => this.props.history.push("/home")}
          >
            Atgal
          </Button>
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

export default compose(withRouter, connect(mapStateToProps, null))(ResultsPage);
