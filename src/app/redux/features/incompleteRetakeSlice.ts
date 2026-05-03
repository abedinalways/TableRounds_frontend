import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersistedAnswerOption {
  id: string;
  option_text: string;
  is_correct: boolean;
  percentage?: number;
}

export interface PersistedExplanation {
  main: string | null;
  image: string | null;
  whyIncorrect: {
    option: string;
    text: string;
  }[];
  pinningPoint: string | null;
  memoryTrick: string | null;
  referance: string[];
}

export interface PersistedAnsweredQuestion {
  testId: string;
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string | null;
  answerOptions: PersistedAnswerOption[];
  explanation: PersistedExplanation | null;
}

interface IncompleteRetakeState {
  answersByTestId: {
    [testId: string]: {
      [questionId: string]: PersistedAnsweredQuestion;
    };
  };
}

const initialState: IncompleteRetakeState = {
  answersByTestId: {},
};

export const incompleteRetakeSlice = createSlice({
  name: 'incompleteRetake',
  initialState,
  reducers: {
    saveIncompleteRetakeAnswer: (
      state,
      action: PayloadAction<PersistedAnsweredQuestion>,
    ) => {
      const { testId, questionId } = action.payload;

      if (!state.answersByTestId[testId]) {
        state.answersByTestId[testId] = {};
      }

      state.answersByTestId[testId][questionId] = action.payload;
    },

    clearIncompleteRetakeTest: (state, action: PayloadAction<string>) => {
      delete state.answersByTestId[action.payload];
    },
  },
});

export const { saveIncompleteRetakeAnswer, clearIncompleteRetakeTest } =
  incompleteRetakeSlice.actions;

export default incompleteRetakeSlice.reducer;
