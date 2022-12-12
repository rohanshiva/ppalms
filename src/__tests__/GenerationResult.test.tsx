import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ProblemSetGenerator } from 'api/ProblemSetGenerator';
import { ProblemType } from 'interface';
import { spread } from '../Util';
import GenerationResult from '../renderer/components/GenerationResult';

const sourceCode = `
import React, { useState } from "react";

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
`;

const sourceCodeLength = sourceCode.split('\n').length;

describe('GenerationResult', () => {
  const wrapGenerationResultProps = (props: any) => {
    return {
      location: {
        state: props,
      },
    };
  };

  const getProblemType = (type: number) => {
    return type === 0 ? 'Reorder' : 'MCQ';
  };

  test.each([
    {
      testType: 'single multiline line-tuple',
      lineTuples: [{ start: 1, end: 3 }],
    },
    {
      testType: 'consequtive multiline line-tuples',
      lineTuples: [
        { start: 1, end: 3 },
        { start: 4, end: 6 },
      ],
    },
    {
      testType: 'mutli-line, single-line, multi-line line-tuples ',
      lineTuples: [
        { start: 1, end: 3 },
        { start: 4, end: 4 },
        { start: 5, end: 6 },
      ],
    },
    {
      testType: 'only single-line line-tuples',
      lineTuples: [
        { start: 1, end: 1 },
        { start: 3, end: 3 },
        { start: 4, end: 4 },
      ],
    },
  ])('render answer of a problem: $testType', ({ lineTuples }) => {
    const problemSet = ProblemSetGenerator.generate(
      [ProblemType.REORDER],
      sourceCode,
      lineTuples,
      {0: 1} as any,
      'PSet Name'
    );
    render(
      <GenerationResult
        {...wrapGenerationResultProps({ problemSet: problemSet })}
      />
    );

    const multilineLineTuples = lineTuples.filter(
      ({ start, end }) => end - start > 0
    );

    multilineLineTuples.forEach(({ start, end }, index) => {
      for (let i = start; i <= end; i++) {
        const answerLine = screen.getByTestId(
          `Reorder-question-answer-0-line-${i}`
        );
        if (index % 2 === 0) {
          expect(answerLine.classList).toContain('highlighted');
        } else {
          expect(answerLine.classList).toContain('highlighted2');
        }
      }
    });

    spread(0, sourceCodeLength - 1)
      .filter(
        (i) =>
          multilineLineTuples.filter(({ start, end }) => start <= i && i <= end)
            .length === 0
      )
      .forEach((lineIndex) => {
        const answerLine = screen.getByTestId(
          `Reorder-question-answer-0-line-${lineIndex}`
        );
        expect(answerLine.classList).not.toContain('highlighted');
        expect(answerLine.classList).not.toContain('highlighted2');
      });
  });

  test('render correct generation result', () => {
    const problemSet = ProblemSetGenerator.generate(
      [ProblemType.REORDER],
      sourceCode,
      [
        { start: 1, end: 2 },
        { start: 3, end: 6 },
      ],
      {0: 10} as any,
      'PSet Name'
    );
    render(
      <GenerationResult
        {...wrapGenerationResultProps({
          problemSet: problemSet,
        })}
      />
    );

    const titleElement = screen.getByTestId('title');

    // check to see that the problem set name is rendered
    expect(titleElement).toHaveTextContent('PSet Name');

    let i = 0;
    for (let problem of problemSet.problems) {
      let questionTypeElement = screen.getByTestId(
        `Reorder-question-type-${i}`
      );
      let questionElement = screen.getByTestId(`Reorder-question-${i}`);

      // check to see if the rendered question type string is as expected.
      expect(getProblemType(problem.type)).toEqual(
        questionTypeElement.innerHTML
      );

      //check to see if the correct question contents are being rendered.
      expect(JSON.stringify(problem.data.question, null, 2)).toEqual(
        questionElement.textContent
      );

      // check to see if the correct answer for that question is being rendered.
      //@ts-ignore
      problem.data.answer.code
        .split('\n')
        //@ts-ignore
        .forEach((expectedLine, lineIndex) => {
          const actualLine = screen.getByTestId(
            `Reorder-question-answer-${i}-line-${lineIndex}`
          );
          expect(actualLine.textContent?.trim()).toBe(expectedLine.trim());
        });
      i += 1;
    }
  });
});
