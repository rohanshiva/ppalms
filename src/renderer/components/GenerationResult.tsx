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

  /**
   * An utility function which deals with rendering the answer of a reordering problem
   * @param problem - the problem whose answer needs to be rendered
   * @returns - the HTML of the rendered answer
   */
  const getAnswer = (problem: Problem, index: number) => {
    const multilineLineTuples = problem.data.answer.lineTuples.filter(
      ({ start, end }) => end - start > 0
    );

    const getMultilineLineTuple = (lineIndex: number) => {
      for (let i = 0; i < multilineLineTuples.length; i++) {
        const { start, end } = multilineLineTuples[i];
        if (start <= lineIndex && end >= lineIndex) {
          return i;
        }
      }

      return null;
    };

    return problem.data.answer.code.split('\n').map((line, i) => {
      let multilineLineTupleIndex = getMultilineLineTuple(i);
      let className = '';
      if (multilineLineTupleIndex != null) {
        if (multilineLineTupleIndex % 2 === 0) {
          className = 'highlighted';
        } else {
          className = 'highlighted2';
        }
      }

      return (
        <span
          data-testid={`question-answer-${index}-line-${i}`}
          key={`${problem.id}-${i}`}
          className={className}
        >{`${line}\n`}</span>
      );
    });
  };

  return (
    <>
      <button
        onClick={(e) => {
          history.replace('/');
        }}
      >
        🏠
      </button>

      <h1 data-testid="title">Problem Set {problemSet.name}</h1>
      <h3>Highlighted regions represent line tuples.</h3>
      {problemSet.problems.map((problem: Problem, i: number) => {
        return (
          <div key={i}>
            <h4 className="question-tag">
              Question {i}{' '}
              {
                <pre
                  data-testid={`question-type-${i}`}
                  className="question-type-tag"
                >
                  {questionTypeTag(problem.type)}
                </pre>
              }
            </h4>
            <pre data-testid={`question-${i}`}>
              {JSON.stringify(problem.data.question, null, 2)}
            </pre>
            <h4>Answer:</h4>
            <pre data-testid={`question-answer-${i}`}>
              {getAnswer(problem, i)}
            </pre>
          </div>
        );
      })}
    </>
  );
};

export default GenerationResult;
