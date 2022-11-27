import { ProblemSetGenerator } from 'api/ProblemSetGenerator';
import { ProblemSet, ProblemType } from 'interface';

describe('ProblemSetGenerator tests', () => {
  it('generate', () => {
    const mockProblemTypes = [ProblemType.REORDER];
    const mockCode = `x = 2\ny = x\nprint(x+y)`;
    const mockLineTuples = [{ start: 0, end: 2 }];
    const mockMaxNumberOfProblems = 2;
    const mockProblemSetName = 'mock_problem_set';

    const problemSet = ProblemSetGenerator.generate(
      mockProblemTypes,
      mockCode,
      mockLineTuples,
      mockMaxNumberOfProblems,
      mockProblemSetName
    ) as ProblemSet;

    expect(problemSet.name).toEqual(mockProblemSetName);
    expect(problemSet.problems.length).toEqual(mockMaxNumberOfProblems);
    expect(problemSet.problemTypes).toEqual(mockProblemTypes);
  });
});
