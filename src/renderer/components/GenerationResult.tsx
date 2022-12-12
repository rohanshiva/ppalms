import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Problem, ProblemSet, ProblemType } from '../../interface';

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
      return 'FillInTheBlank';
    }
  }
};

/**
   * An utility function that splits the problem set by the problem type
   * @param problemSet - the problemSet that is to be split
   * @returns {[[]]} returns an 2d array containg all the problems, where each index of the top level array contains all the problems for that specific type.
   */
const splitProblems = (problemSet: ProblemSet) => {
  const problemsByType: Map<ProblemType, Problem[]> = new Map();

  for (const problemType of problemSet.problemTypes) {
    problemsByType.set(problemType, []);
  }

  for (const problem of problemSet.problems) {
    problemsByType.set(problem.type, [...problemsByType.get(problem.type) as Problem[], problem])
  }

  return problemsByType
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
  const problemsByType = splitProblems(problemSet);

  const getQuestionContent = (problem: Problem) => {
    switch(problem.type){
      case ProblemType.REORDER: {
        return JSON.stringify(problem.data.question, null, 2);
      }
      case ProblemType.FILL_IN_THE_BLANK: {
        return problem.data.question;
      }
      case ProblemType.MULTIPLE_CHOICE: {
        return ''
      }
    }
  }

  /**
   * An utility function which deals with rendering the answer based on the problem's type.
   * @param problem - the problem whose answer needs to be rendered
   * @returns - the HTML of the rendered answer
   */
  const getAnswer = (problem: Problem, index: number) => {
    if (problem.type === ProblemType.FILL_IN_THE_BLANK) {
      //@ts-ignore
      return <span>{JSON.stringify(problem.data.answer)}</span>;
    }

    //@ts-ignore
    const multilineLineTuples = problem.data.answer.lineTuples.filter(
      //@ts-ignore
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

    //@ts-ignore
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
          data-testid={`${questionTypeTag(
            problem.type
          )}-question-answer-${index}-line-${i}`}
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
      {problemSet &&
        Array.from(problemsByType.keys()).map((problemType: ProblemType) => (
          <>
            <h2 key={problemType}>{questionTypeTag(problemType) + ' Problems'}</h2>
            {problemType === ProblemType.REORDER && (
              <h3>Highlighted regions represent line tuples.</h3>
            )}

            {(problemsByType.get(problemType) as Problem[]).map((problem: Problem, problemIndex: number) => {
              return (
                <div key={`${problemType}-${problemIndex}`}>
                  <h4 className="question-tag">
                    Question {problemIndex + 1}{' '}
                    {
                      <pre
                        data-testid={`${questionTypeTag(
                          problem.type
                        )}-question-type-${problemIndex}`}
                        className="question-type-tag"
                      >
                        {questionTypeTag(problem.type)}
                      </pre>
                    }
                  </h4>
                  <pre
                    data-testid={`${questionTypeTag(
                      problem.type
                    )}-question-${problemIndex}`}
                  >
                    {getQuestionContent(problem)}
                  </pre>
                  <h4>Answer:</h4>
                  <pre
                    data-testid={`${questionTypeTag(
                      problem.type
                    )}-question-answer-${problemIndex}`}
                  >
                    {getAnswer(problem, problemIndex)}
                  </pre>
                </div>
              );
            })}
          </>
        ))}
    </>
  );
};

export default GenerationResult;
