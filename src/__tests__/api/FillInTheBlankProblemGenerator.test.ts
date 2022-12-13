import { FillInTheBlankProblemGenerator } from 'api/FillInTheBlankProblemGenerator';
import { ProblemType } from 'interface';

describe('FillInTheBlankProblemGenerator', () => {
  const pythonSourceCode = `
  x = 1
  y = 0
  z = x + y
  if z == 8:
    a = 1
    b = 2
  `;

  const fillInQuestionWithAnswer = (question: string, answer: string[]) => {
    let questionCode = question;
    for (const fill of answer) {
      const target = '_'.repeat(fill.length);
      questionCode = questionCode.replace(target, fill);
    }
    return questionCode;
  };

  test('generates a single fill in the blank problem', () => {
    const generator = new FillInTheBlankProblemGenerator(
      pythonSourceCode,
      [],
      1
    );
    const problems = generator.generate();
    expect(problems.length).toBe(1);
    const problem = problems[0];
    expect(problem.type).toBe(ProblemType.FILL_IN_THE_BLANK);
    const actualFilledOutCode = fillInQuestionWithAnswer(
      problem.data.question as string,
      problem.data.answer as string[]
    );
    expect(pythonSourceCode).toBe(actualFilledOutCode);
  });

  test('generate a single fill in the blank with literal strings', () => {
    const sourceCode = `
    x0='1 time' + '2 time'
    `;

    // exhaustively generate possible fill in the blank problems
    const generator = new FillInTheBlankProblemGenerator(sourceCode, [], 10);
    for (const problem of generator.generate()) {
      expect(problem.type).toBe(ProblemType.FILL_IN_THE_BLANK);
      const actualFilledOutCode = fillInQuestionWithAnswer(
        problem.data.question as string,
        problem.data.answer as string[]
      );
      expect(sourceCode).toBe(actualFilledOutCode);
    }
  });
});
