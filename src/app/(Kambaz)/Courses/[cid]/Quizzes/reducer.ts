import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Type definitions
export interface Choice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

export interface BlankAnswer {
  _id: string;
  text: string;
}

export interface Question {
  _id: string;
  title: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  points: number;
  question: string;
  choices: Choice[];
  correctAnswer: boolean; // For TRUE_FALSE
  blankAnswers: BlankAnswer[]; // For FILL_IN_BLANK
}

export interface Quiz {
  _id: string;
  title: string;
  course: string;
  description: string;
  quizType: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  assignmentGroup: "Quizzes" | "Exams" | "Assignments" | "Project";
  shuffleAnswers: boolean;
  timeLimit: number;
  hasTimeLimit: boolean;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: "Immediately" | "After Due Date" | "Never";
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableDate: string;
  untilDate: string;
  published: boolean;
  questions: Question[];
  points: number;
}

interface QuizzesState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
}

const initialState: QuizzesState = {
  quizzes: [],
  currentQuiz: null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
    },
    setCurrentQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.currentQuiz = action.payload;
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.push(action.payload);
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz._id !== action.payload
      );
    },
    updateQuiz: (state, action: PayloadAction<Quiz>) => {
      const index = state.quizzes.findIndex(
        (quiz) => quiz._id === action.payload._id
      );
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
      if (state.currentQuiz?._id === action.payload._id) {
        state.currentQuiz = action.payload;
      }
    },
    togglePublish: (state, action: PayloadAction<string>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload);
      if (quiz) {
        quiz.published = !quiz.published;
      }
    },
    // Question actions
    addQuestion: (state, action: PayloadAction<{ quizId: string; question: Question }>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload.quizId);
      if (quiz) {
        quiz.questions.push(action.payload.question);
        quiz.points = quiz.questions.reduce((sum, q) => sum + q.points, 0);
      }
      if (state.currentQuiz?._id === action.payload.quizId) {
        state.currentQuiz.questions.push(action.payload.question);
        state.currentQuiz.points = state.currentQuiz.questions.reduce((sum, q) => sum + q.points, 0);
      }
    },
    updateQuestion: (state, action: PayloadAction<{ quizId: string; question: Question }>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload.quizId);
      if (quiz) {
        const qIndex = quiz.questions.findIndex((q) => q._id === action.payload.question._id);
        if (qIndex !== -1) {
          quiz.questions[qIndex] = action.payload.question;
          quiz.points = quiz.questions.reduce((sum, q) => sum + q.points, 0);
        }
      }
      if (state.currentQuiz?._id === action.payload.quizId) {
        const qIndex = state.currentQuiz.questions.findIndex((q) => q._id === action.payload.question._id);
        if (qIndex !== -1) {
          state.currentQuiz.questions[qIndex] = action.payload.question;
          state.currentQuiz.points = state.currentQuiz.questions.reduce((sum, q) => sum + q.points, 0);
        }
      }
    },
    deleteQuestion: (state, action: PayloadAction<{ quizId: string; questionId: string }>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload.quizId);
      if (quiz) {
        quiz.questions = quiz.questions.filter((q) => q._id !== action.payload.questionId);
        quiz.points = quiz.questions.reduce((sum, q) => sum + q.points, 0);
      }
      if (state.currentQuiz?._id === action.payload.quizId) {
        state.currentQuiz.questions = state.currentQuiz.questions.filter(
          (q) => q._id !== action.payload.questionId
        );
        state.currentQuiz.points = state.currentQuiz.questions.reduce((sum, q) => sum + q.points, 0);
      }
    },
  },
});

export const {
  setQuizzes,
  setCurrentQuiz,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  togglePublish,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;