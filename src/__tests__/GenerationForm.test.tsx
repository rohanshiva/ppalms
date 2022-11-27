import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, cleanup} from '@testing-library/react';
import GenerationForm from 'renderer/components/GenerationForm';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { toast } from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const props = {
  location: {
    state: {
      codeLines: [],
      lineTuples: [],
      editorState: {
        lineTuples: [],
        lineTupleStart: null,
      },
      editorProps: {
        code: '',
      },
    },
  },
};

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe('GenerationForm', () => {

  const setup = () => {

    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <GenerationForm {...props} />
      </Router>
    );

  }


  test('form not being able to submit until all the required inputs have been satisfied', async () => {

    setup();

    const numberOfProblemsField = screen.getByTestId(
      'problems-field'
    ) as HTMLInputElement;

    const problemSetNameField = screen.getByTestId(
      'problemset-name-field'
    ) as HTMLInputElement;

    // to test the inputs are required and have default values before any user events.
    expect(numberOfProblemsField).toBeInvalid();
    expect(problemSetNameField).toBeInvalid();

  });

  test('show error toast when the form is submitted without choosing at least one ppalm problem type to generate.',async () => {

    setup();

    const numberOfProblemsField = screen.getByTestId(
      'problems-field'
    ) as HTMLInputElement;

    const problemSetNameField = screen.getByTestId(
      'problemset-name-field'
    ) as HTMLInputElement;

    // inflate the number of problems field and problem set name field with valid values
    await userEvent.type(numberOfProblemsField, '10');
    await userEvent.type(problemSetNameField, 'Example name');

    const submitBttn = screen.getByTestId('submit-bttn') as HTMLInputElement;

    await userEvent.click(submitBttn);

    // test to see if toast gets triggered when both reorder and mutliple choice checkboxes are not ticked and submit button is clicked
    expect(toast.error).toBeCalledTimes(1);

  });

  test('Form should successfully submit and navigate to the next step when all inputs are valid.',async () => {

    setup();

    const numberOfProblemsField = screen.getByTestId(
      'problems-field'
    ) as HTMLInputElement;

    const problemSetNameField = screen.getByTestId(
      'problemset-name-field'
    ) as HTMLInputElement;

    // inflate the number of problems field and problem set name field with valid values
    await userEvent.type(numberOfProblemsField, '10');
    await userEvent.type(problemSetNameField, 'Example name');

    const reorderCheckbox = screen.getByTestId(
      'reorder-checkbox'
    ) as HTMLInputElement;
    const multipleChoiceCheckbox = screen.getByTestId(
      'multiple-choice-checkbox'
    ) as HTMLInputElement;

    await userEvent.click(multipleChoiceCheckbox);
    await userEvent.click(reorderCheckbox);

    const submitBttn = screen.getByTestId('submit-bttn') as HTMLInputElement;

    await userEvent.click(submitBttn);

    // test to see that error toast was not called when at all the required fields where filled.
    expect(toast.error).toBeCalledTimes(0);
    
  });
});
