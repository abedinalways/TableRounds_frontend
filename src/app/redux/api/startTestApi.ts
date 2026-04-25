// import { baseApi } from './baseApi';

// export interface StartTestPayload {
//   total_questions: number;
//   test_mode: string[];
//   difficulty: string[];
//   topic: string[];
// }

// export interface AnswerQuestionPayload {
//   test_id: string;
//   question_id: string;
//   answer_option_id: string;
// }

// export interface StartTestResponse {
//   success: boolean;
//   message: string;
//   data?: {
//     id: string;
//     test_mode: string[];
//     total_questions: number;
//     questions: {
//       id: string;
//       question_title: string;
//       question_steam: string;
//       answerOptions: {
//         id: string;
//         option_text: string;
//       }[];
//     }[];
//   };
// }

// export const startTestApi = baseApi.injectEndpoints({
//   endpoints: builder => ({
//     // start test
//     startTest: builder.mutation<StartTestResponse, StartTestPayload>({
//       query: body => ({
//         url: '/test',
//         method: 'POST',
//         body,
//         credentials: 'include',
//       }),
//     }),

//     //get test api

//     // answer question
//     answerQuestion: builder.mutation<
//       { success: boolean; message: string },
//       AnswerQuestionPayload
//     >({
//       query: body => ({
//         url: '/test/answer',
//         method: 'POST',
//         body,
//         credentials: 'include',
//       }),
//     }),
//     //result
//     getTestResult: builder.query({
//       query: test_id => ({
//         url: `/test/result`,
//         method: 'GET',
//         params: { test_id },
//         credentials: 'include',
//       }),
//     }),
//   }),
// });

// export const {
//   useStartTestMutation,
//   useAnswerQuestionMutation,
//   useGetTestResultQuery,
// } = startTestApi;


import { baseApi } from './baseApi';

export interface StartTestPayload {
  total_questions: number;
  test_mode: string[];
  difficulty: string[];
  topic: string[];
}

export interface AnswerQuestionPayload {
  test_id: string;
  question_id: string;
  answer_option_id: string;
}

export interface TestQuestion {
  id: string;
  question_title: string | null;
  question_id: string;
  question_steam: string;
  answerOptions: {
    id: string;
    option_text: string;
  }[];
}

export interface UserAnswer {
  id: string;
  question_id: string;
  is_marked: boolean;
}

export interface TestData {
  id: string;
  created_at: string;
  user_id: string;
  test_mode: string[];
  difficulty: string[];
  topic: string[];
  total_attempts: number;
  total_questions: number;
  score: number | null;
  is_completed: boolean;
  questions: TestQuestion[];
  user_answers: UserAnswer[];
}

export interface StartTestResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    test_mode: string[];
    total_questions: number;
    questions: TestQuestion[];
  };
}

export interface GetTestResponse {
  success: boolean;
  message: string;
  data: TestData;
}

export const startTestApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // start test
    startTest: builder.mutation<StartTestResponse, StartTestPayload>({
      query: body => ({
        url: '/test',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),

    // get test by id
    getTest: builder.query<GetTestResponse, string>({
      query: id => ({
        url: `/test/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
   // answer question
        answerQuestion: builder.mutation<
          { success: boolean; message: string },
          AnswerQuestionPayload
        >({
          query: body => ({
            url: '/test/answer',
            method: 'POST',
            body,
            credentials: 'include',
          }),
        }),
        //result
        getTestResult: builder.query({
          query: test_id => ({
            url: `/test/result`,
            method: 'GET',
            params: { test_id },
            credentials: 'include',
          }),
        }),
  }),
});

export const {
  useStartTestMutation,
  useGetTestQuery,
  useAnswerQuestionMutation,
  useGetTestResultQuery,
} = startTestApi;