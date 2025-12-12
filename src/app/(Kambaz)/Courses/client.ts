/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const ENROLLMENTS_API = `${HTTP_SERVER}/api/enrollments`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;
const ATTEMPTS_API = `${HTTP_SERVER}/api/attempts`;


export const deleteModule = async (courseId: string, moduleId: string) => {
  const response = await axios.delete(`${COURSES_API}/${courseId}/modules/${moduleId}`);
  return response.data;
};

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses/current/courses/`);
  return data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};
export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};
export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};
export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const updateModule = async (courseId: string, module: any) => {
  const { data } = await axios.put(`${COURSES_API}/${courseId}/modules/${module._id}`, module);
  return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  const response = await axios.post(`${COURSES_API}/${courseId}/assignments`, assignment);
  return response.data;
};


export const updateAssignment = async (assignment: any) => {
  const { data } = await axios.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

export const enrollInCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.post(
    `${ENROLLMENTS_API}/users/${userId}/courses/${courseId}`
  );
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const unenrollFromTheCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const unenrollFromCourse = async (enrollmentId: string) => {
  const { data } = await axios.delete(
    `${ENROLLMENTS_API}/${enrollmentId}`
  );
  return data;
};

export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};

export const findEnrollmentsForUser = async (userId: string) => {
  const { data } = await axios.get(
    `${ENROLLMENTS_API}/users/${userId}`
  );
  return data;
};

// QUIZ FUNCTIONS 

// Quiz CRUD
export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const updateQuiz = async (quizId: string, quiz: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const publishQuiz = async (quizId: string, published: boolean) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`, { published });
  return response.data;
};

// Question CRUD
export const addQuestion = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/questions`, question);
  return response.data;
};

export const updateQuestion = async (quizId: string, questionId: string, question: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/questions/${questionId}`, question);
  return response.data;
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}/questions/${questionId}`);
  return response.data;
};

// Question Group CRUD
export const addQuestionGroup = async (quizId: string, group: any) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/groups`, group);
  return response.data;
};

export const updateQuestionGroup = async (quizId: string, groupId: string, group: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/groups/${groupId}`, group);
  return response.data;
};

export const deleteQuestionGroup = async (quizId: string, groupId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}/groups/${groupId}`);
  return response.data;
};

export const addQuestionToGroup = async (quizId: string, groupId: string, question: any) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/groups/${groupId}/questions`, question);
  return response.data;
};

export const updateQuestionInGroup = async (quizId: string, groupId: string, questionId: string, question: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/groups/${groupId}/questions/${questionId}`, question);
  return response.data;
};

export const deleteQuestionFromGroup = async (quizId: string, groupId: string, questionId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}/groups/${groupId}/questions/${questionId}`);
  return response.data;
};

// Find Questions (search across course)
export const searchQuestionsInCourse = async (courseId: string, searchTerm: string = "") => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/questions/search?q=${encodeURIComponent(searchTerm)}`);
  return response.data;
};

// Quiz Attempts
export const getAttemptStatus = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/status`);
  return response.data;
};

export const startAttempt = async (quizId: string, accessCode?: string) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts/start`, { accessCode });
  return response.data;
};

export const getLatestAttempt = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/latest`);
  return response.data;
};

export const saveAnswer = async (attemptId: string, answer: any) => {
  const response = await axiosWithCredentials.put(`${ATTEMPTS_API}/${attemptId}/answer`, answer);
  return response.data;
};

export const submitAttempt = async (attemptId: string, timedOut: boolean = false) => {
  const response = await axiosWithCredentials.post(`${ATTEMPTS_API}/${attemptId}/submit`, { timedOut });
  return response.data;
};

export const getAttempt = async (attemptId: string) => {
  const response = await axiosWithCredentials.get(`${ATTEMPTS_API}/${attemptId}`);
  return response.data;
};