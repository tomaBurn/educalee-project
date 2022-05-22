import { LOGIN_SUCCESS, LOGOUT } from "../constants";

const initialState = {
  id: null,
  username: null,
  isTeacher: null,
  level: null,
  teacherId: null,
  score: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      state.id = action.id;
      state.username = action.username;
      state.isTeacher = action.isTeacher;
      state.level = action.level;
      state.teacherId = action.teacherId;
      state.score = action.score;
      return { ...state };
    }
    case LOGOUT: {
      state.id = null;
      state.username = null;
      state.isTeacher = null;
      state.level = null;
      state.teacherId = null;
      state.score = null;
      return { ...state };
    }
    default:
      return state;
  }
};
