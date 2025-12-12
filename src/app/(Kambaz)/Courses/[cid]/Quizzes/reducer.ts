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

// New: Question Group interface
export interface QuestionGroup {
  _id: string;
  name: string;
  pickCount: number | null; // null = use all questions, otherwise pick N random
  pointsPerQuestion: number;
  questions: Question[];
}

// Search result question (with source info)
export interface SearchedQuestion extends Question {
  sourceQuizId: string;
  sourceQuizTitle: string;
  sourceGroupId?: string;
  sourceGroupName?: string;
  sourceType: "question" | "group_question";
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
  questionGroups: QuestionGroup[]; // New field
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

// Helper function to calculate total points
const calculateTotalPoints = (quiz: Quiz): number => {
  const questionPoints = (quiz.questions || []).reduce((sum, q) => sum + q.points, 0);
  const groupPoints = (quiz.questionGroups || []).reduce((groupSum, group) => {
    const questionsToCount = group.pickCount || group.questions.length;
    return groupSum + (questionsToCount * group.pointsPerQuestion);
  }, 0);
  return questionPoints + groupPoints;
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
        quiz.points = calculateTotalPoints(quiz);
      }
      if (state.currentQuiz?._id === action.payload.quizId) {
        state.currentQuiz.questions.push(action.payload.question);
        state.currentQuiz.points = calculateTotalPoints(state.currentQuiz);
      }
    },
    updateQuestion: (state, action: PayloadAction<{ quizId: string; question: Question }>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload.quizId);
      if (quiz) {
        const qIndex = quiz.questions.findIndex((q) => q._id === action.payload.question._id);
        if (qIndex !== -1) {
          quiz.questions[qIndex] = action.payload.question;
          quiz.points = calculateTotalPoints(quiz);
        }
      }
      if (state.currentQuiz?._id === action.payload.quizId) {
        const qIndex = state.currentQuiz.questions.findIndex((q) => q._id === action.payload.question._id);
        if (qIndex !== -1) {
          state.currentQuiz.questions[qIndex] = action.payload.question;
          state.currentQuiz.points = calculateTotalPoints(state.currentQuiz);
        }
      }
    },
    deleteQuestion: (state, action: PayloadAction<{ quizId: string; questionId: string }>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload.quizId);
      if (quiz) {
        quiz.questions = quiz.questions.filter((q) => q._id !== action.payload.questionId);
        quiz.points = calculateTotalPoints(quiz);
      }
      if (state.currentQuiz?._id === action.payload.quizId) {
        state.currentQuiz.questions = state.currentQuiz.questions.filter(
          (q) => q._id !== action.payload.questionId
        );
        state.currentQuiz.points = calculateTotalPoints(state.currentQuiz);
      }
    },

    // ========== QUESTION GROUP ACTIONS ==========
    addQuestionGroup: (state, action: PayloadAction<{ quizId: string; group: QuestionGroup }>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload.quizId);
      if (quiz) {
        if (!quiz.questionGroups) quiz.questionGroups = [];
        quiz.questionGroups.push(action.payload.group);
        quiz.points = calculateTotalPoints(quiz);
      }
      if (state.currentQuiz?._id === action.payload.quizId) {
        if (!state.currentQuiz.questionGroups) state.currentQuiz.questionGroups = [];
        state.currentQuiz.questionGroups.push(action.payload.group);
        state.currentQuiz.points = calculateTotalPoints(state.currentQuiz);
      }
    },
    updateQuestionGroup: (state, action: PayloadAction<{ quizId: string; group: QuestionGroup }>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload.quizId);
      if (quiz && quiz.questionGroups) {
        const gIndex = quiz.questionGroups.findIndex((g) => g._id === action.payload.group._id);
        if (gIndex !== -1) {
          quiz.questionGroups[gIndex] = action.payload.group;
          quiz.points = calculateTotalPoints(quiz);
        }
      }
      if (state.currentQuiz?._id === action.payload.quizId && state.currentQuiz.questionGroups) {
        const gIndex = state.currentQuiz.questionGroups.findIndex((g) => g._id === action.payload.group._id);
        if (gIndex !== -1) {
          state.currentQuiz.questionGroups[gIndex] = action.payload.group;
          state.currentQuiz.points = calculateTotalPoints(state.currentQuiz);
        }
      }
    },
    deleteQuestionGroup: (state, action: PayloadAction<{ quizId: string; groupId: string }>) => {
      const quiz = state.quizzes.find((q) => q._id === action.payload.quizId);
      if (quiz && quiz.questionGroups) {
        quiz.questionGroups = quiz.questionGroups.filter((g) => g._id !== action.payload.groupId);
        quiz.points = calculateTotalPoints(quiz);
      }
      if (state.currentQuiz?._id === action.payload.quizId && state.currentQuiz.questionGroups) {
        state.currentQuiz.questionGroups = state.currentQuiz.questionGroups.filter(
          (g) => g._id !== action.payload.groupId
        );
        state.currentQuiz.points = calculateTotalPoints(state.currentQuiz);
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
  addQuestionGroup,
  updateQuestionGroup,
  deleteQuestionGroup,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;