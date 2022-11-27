import { useHistory } from 'react-router-dom';
import { Problem, ProblemType } from '../../interface';

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
  const history = useHistory();
  const { problemSet } = props.location.state;
  return (
    <>
      <button
        onClick={(e) => {
          history.replace('/');
        }}
      >
        🏠
      </button>

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
