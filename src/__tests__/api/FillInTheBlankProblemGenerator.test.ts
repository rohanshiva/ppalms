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
    const blankedOutWords = problem.data.answer as string[];
    for (const blankedOutWord of blankedOutWords) {
      const expectedReplacement = '_'.repeat(blankedOutWord.length);
      expect(
        (problem.data.question as string).includes(expectedReplacement)
      ).toBe(true);
    }
  });
});
