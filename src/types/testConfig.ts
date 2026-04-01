export type Topic = {
  id: string;
  name: string;
};

export type TestConfig = {
  questionsPerBlock: number | 'all';
  
  testStatus: (
    | 'Used'
    | 'Unused'
    | 'Correct'
    | 'Incorrect'
    | 'Omitted'
    | 'Marked'
  )[];
  difficulty: ['Intern' | 'Senior' | 'Boards'];
  selectedTopics: string[]; 
};
