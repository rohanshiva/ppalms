import { ProblemSetGenerator } from 'api/ProblemSetGenerator';
import { ProblemSet, ProblemType } from 'interface';

const mockCode = `x = 2\ny = x\nprint(x+y)`;
const mockLineTuples = [{ start: 0, end: 2 }];
const mockProblemTypes = [ProblemType.REORDER];

describe('ProblemSetGenerator', () => {
  test('successfully generate a problem set', () => {
    const mockMaxNumberOfProblems = 2;
    const mockProblemSetName = 'mock_problem_set';
    let problemTypesConfig: any = {};
    problemTypesConfig[ProblemType.REORDER] = mockMaxNumberOfProblems;

    const problemSet = ProblemSetGenerator.generate(
      mockProblemTypes,
      mockCode,
      mockLineTuples,
      problemTypesConfig,
      mockProblemSetName
    ) as ProblemSet;

    expect(problemSet.name).toEqual(mockProblemSetName);
    expect(problemSet.problems.length).toEqual(mockMaxNumberOfProblems);
    expect(problemSet.problemTypes).toEqual(mockProblemTypes);
  });

  test.each([
    {
      maxProblems: 10,
      problemSetName: '',
      expectedError: "'name' cannot be an empty or a blank string",
    },
  ])(
    'failed to generate a problem set: $expectedError',
    ({ maxProblems, problemSetName, expectedError }) => {
      expect(() => {
        let problemTypesConfig: any = {};
        problemTypesConfig[ProblemType.REORDER] = maxProblems;

        ProblemSetGenerator.generate(
          mockProblemTypes,
          mockCode,
          mockLineTuples,
          problemTypesConfig,
          problemSetName
        );
      }).toThrowError(expectedError);
    }
  );
});
