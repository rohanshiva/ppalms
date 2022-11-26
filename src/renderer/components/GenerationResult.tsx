import { Link } from 'react-router-dom';
import { Problem, ProblemType } from '../../interface';

const formatProblems = (problems: Problem[]) => {
  return problems.map((problem: Problem) => {
    problem.data.answer = unescape(problem.data.answer);

    return problem;
  });
};

const questionTypeTag = (type: ProblemType) => {
  switch (type) {
    case ProblemType.REORDER: {
      return 'Reorder';
    }
    case ProblemType.MULTIPLE_CHOICE: {
      return 'MCQ';
    }
  }
};

const GenerationResult = (props: any) => {
  const { problemSet } = props.location.state;
  console.log(
    problemSet.problems.map((problem: Problem, i: number) => {
      return (
        <>
          <div>{JSON.stringify(problem)}</div>
        </>
      );
    })
  );
  return (
    <>
      <Link to="/">
        <button>🏠</button>
      </Link>
      <h1>Problem Set {problemSet.name}</h1>
      <div>
        {problemSet.problems.map((problem: Problem, i: number) => {
          return (
            <>
              <h4 className="question-tag">
                Question {i}{' '}
                {
                  <pre className="question-type-tag">
                    {questionTypeTag(problem.type)}
                  </pre>
                }
              </h4>
              <pre>{JSON.stringify(problem.data.question, null, 2)}</pre>
              <h4>Answer:</h4>
              <pre>{problem.data.answer}</pre>
            </>
          );
        })}
      </div>
    </>
  );
};

export default GenerationResult;
