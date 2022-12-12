import { useEffect, useState } from 'react';
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
    case ProblemType.FILL_IN_THE_BLANK: {
      return 'FillInTheBlank'
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
  const [problemSet1, setProblemSet] = useState<[]>();

  /**
   * An utility function that splits the problem set by the problem type
   * @param problemSet - the problemSet that is to be split
   * @returns {[[]]} returns an 2d array containg all the problems, where each index of the top level array contains all the problems for that specific type.
   */
  const splitProblems = (problemSet: any) => {
    
    let problems: any = [];

    for(let val of problemSet.problemTypes) {
      problems.push([]);
    }

    for(let problem of problemSet.problems){
      problems[problem.type].push(problem)
    }

    console.log(problems)

    return problems;

  }

  useEffect(() => {
    const { problemSet } = props.location.state;
    setProblemSet(splitProblems(problemSet))
  },[])


  /**
   * An utility function which deals with rendering the answer based on the problem's type.
   * @param problem - the problem whose answer needs to be rendered
   * @returns - the HTML of the rendered answer
   */
  const getAnswer = (problem: Problem, index: number) => {

    if(problem.type !== ProblemType.REORDER) {
      return (
        <span>
          {problem.data.answer.code}
        </span>
      )
    }

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
          data-testid={`${questionTypeTag(problem.type)}-question-answer-${index}-line-${i}`}
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
      {problemSet1 && problemSet1.map((problems: [], i: number) =>
        <>
          <h2 key={i}>
          {questionTypeTag(i) + " Problems"}
        </h2>
        {i === ProblemType.REORDER && (<h3>Highlighted regions represent line tuples.</h3>)}

        {problems.map((problem: Problem, j: number) => {
        return (
          <div key={`${i}-${j}`}>
            <h4 className="question-tag">
              Question {i}{' '}
              {
                <pre
                  data-testid={`${questionTypeTag(problem.type)}-question-type-${j}`}
                  className="question-type-tag"
                >
                  {questionTypeTag(problem.type)}
                </pre>
              }
            </h4>
            <pre data-testid={`${questionTypeTag(problem.type)}-question-${j}`}>
              {JSON.stringify(problem.data.question, null, 2)}
            </pre>
            <h4>Answer:</h4>
            <pre data-testid={`${questionTypeTag(problem.type)}-question-answer-${j}`}>
              {getAnswer(problem, j)}
            </pre>
          </div>
        );
      })}
        </> 
      )}
    </>
  );
};

export default GenerationResult;
