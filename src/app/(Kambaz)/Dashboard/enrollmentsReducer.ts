import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enrollments } from "../Database";

interface Enrollment {
  _id: string;
  user: string;
  course: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
}

const initialState: EnrollmentsState = {
  enrollments: enrollments as Enrollment[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
    addEnrollment: (state, action: PayloadAction<Enrollment>) => {
      state.enrollments = [...state.enrollments, action.payload];
    },
    removeEnrollment: (state, action: PayloadAction<Enrollment>) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) => enrollment._id !== action.payload._id
      );
    },
  },
});

export const { setEnrollments, addEnrollment, removeEnrollment } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;