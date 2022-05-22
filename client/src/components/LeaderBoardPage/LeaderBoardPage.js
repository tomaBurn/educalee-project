import React from "react";
import { connect } from "react-redux";
import { axiosJWT } from "../../App.js";
import { Container } from "reactstrap";
import CustomPaginationActionsTable from "./Table";

class LeaderBoardPage extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    const { currentUser } = this.props;

    axiosJWT
      .post("/api/leaderboard", {
        headers: { "x-access-token": localStorage.getItem("token") },
        teacherId:
          currentUser.isTeacher === "Y"
            ? currentUser.id
            : currentUser.teacherId,
      })
      .then((response) => {
        this.setState({ list: response.data, studentId: currentUser.isTeacher === 'Y' ? null : currentUser.id, isLoading: false });
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.isLoading) return <div>loading</div>;
    return (
      <Container>
        <div style={{ padding: 32 }}>
          <div style={{ paddingBottom: 16 }}>
            <h3>Lyderių lenta</h3>
          </div>
          <CustomPaginationActionsTable
            studentId={this.state.studentId}
            students={this.state.list}
          />
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

export default connect(mapStateToProps, null)(LeaderBoardPage);
