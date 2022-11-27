import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import exp from 'constants';
import GenerationResult from '../renderer/components/GenerationResult';
import sampleProblemSet from '../testData/sampleProblemSet';

const props = {
  location: {
    state: {
      problemSet: sampleProblemSet,
    },
  },
};

const getProblemType = (type: number) => {
  return type === 0 ? 'Reorder' : 'MCQ';
};

test('render correct generation result', () => {
  render(<GenerationResult {...props} />);

  const titleElement = screen.getByTestId('title');

  // check to see that the problem set name is rendered
  expect(titleElement).toHaveTextContent(sampleProblemSet.name);

  let i = 0;
  for (let problem of sampleProblemSet.problems) {
    let questionTypeElement = screen.getByTestId(`question-type-${i}`);
    let questionElement = screen.getByTestId(`question-${i}`);
    let questionAnswerElement = screen.getByTestId(`question-answer-${i}`);

    // check to see if the rendered question type string is as expected.
    expect(getProblemType(problem.type)).toEqual(questionTypeElement.innerHTML);

    //check to see if the correct question contents are being rendered.
    expect(JSON.stringify(problem.data.question, null, 2)).toEqual(
      questionElement.innerHTML
    );

    // check to see if the correct answer for that question is being rendered.
    expect(problem.data.answer).toEqual(questionAnswerElement.innerHTML);

    i += 1;
  }
});
