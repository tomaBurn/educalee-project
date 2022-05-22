import { LOGIN_SUCCESS, LOGOUT } from "../constants";

export function loginSuccess(currentUser) {
  return {
    type: LOGIN_SUCCESS,
    id: currentUser.id,
    username: currentUser.username,
    isTeacher: currentUser.is_teacher,
    level: currentUser.level,
    teacherId: currentUser.teacher_id,
    score: currentUser.score,
  };
}

export function logout() {
  return {
    type: LOGOUT,
    id: null,
    username: null,
    isTeacher: null,
    level: null,
    teacherId: null,
    score: null,
  };
}
