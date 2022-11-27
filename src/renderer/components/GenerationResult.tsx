import { useHistory } from 'react-router-dom';
import { Problem, ProblemType } from '../../interface';

 /**
   * Utility function that returns the correct 'question type' string to display based on the problem type.
   * @param type - the {@link problemType} object to get the display string from.
   * @returns {string} the question type string to display.
   */
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

/**
 * Generation Result component show all the generated problems. Displays the question, the answer and the ppalm question type
 * for each problem.
 * @param props
 *  - problemSet : the generated problem set
 * @returns {HTML} the HTML tree of the Generation Result component
 */
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
