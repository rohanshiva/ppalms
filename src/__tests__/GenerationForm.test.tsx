import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, cleanup } from '@testing-library/react';
import GenerationForm, {
  ProblemTypesConfig,
} from 'renderer/components/GenerationForm';

import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { toast } from 'react-hot-toast';
import { ProblemType } from 'interface';

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const defaultProps = {
  location: {
    state: {
      codeLines: [],
      lineTuples: [],
      linePickerState: {
        lineTuples: [],
        lineTupleStart: null,
      },
      linePickerProps: {
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
  const setup = (props: any) => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <GenerationForm {...props} />
      </Router>
    );
  };

  test('checkboxes should be triggered correctly on user click', async () => {
    setup(defaultProps);

    const reorderCheckbox = screen.getByTestId(
      'reorder-checkbox'
    ) as HTMLInputElement;

    const multipleChoiceCheckbox = screen.getByTestId(
      'multiple-choice-checkbox'
    ) as HTMLInputElement;

    const fillInTheBlankCheckbox = screen.getByTestId(
      'fill-in-the-blank-checkbox'
    ) as HTMLInputElement;


    // all the checkboxes should not have been checked already
    expect(reorderCheckbox.checked).toBe(false);
    expect(multipleChoiceCheckbox.checked).toBe(false);
    expect(fillInTheBlankCheckbox.checked).toBe(false);

    // simulate the user clicking on all the checkboxes
    await userEvent.click(reorderCheckbox);
    await userEvent.click(multipleChoiceCheckbox);
    await userEvent.click(fillInTheBlankCheckbox);

    // all the checkboxes should now be checked
    expect(reorderCheckbox.checked).toBe(true);
    expect(multipleChoiceCheckbox.checked).toBe(true);
    expect(fillInTheBlankCheckbox.checked).toBe(true);

  })

  test('form not being able to submit until all the required inputs have been satisfied', async () => {
    // passing mock initial problem types config with all the problem types selected
    // as number of problems for each problem type only appear if they are selected
    let baseProblemTypesConfig: ProblemTypesConfig = {
      [ProblemType.REORDER]: {
        selected: true,
        numberOfProblems: 0,
      },
      [ProblemType.MULTIPLE_CHOICE]: {
        selected: true,
        numberOfProblems: 0,
      },
      [ProblemType.FILL_IN_THE_BLANK]: {
        selected: true,
        numberOfProblems: 0,
      },
    };

    const props = { ...defaultProps, baseProblemTypesConfig };

    setup(props);

    const numberOfProblemsFieldReorder = screen.getByTestId(
      `number-of-problems-field-${ProblemType.REORDER}`
    ) as HTMLInputElement;

    const numberOfProblemsFieldMultipleChoice = screen.getByTestId(
      `number-of-problems-field-${ProblemType.MULTIPLE_CHOICE}`
    ) as HTMLInputElement;

    const problemSetNameField = screen.getByTestId(
      'problemset-name-field'
    ) as HTMLInputElement;

    const numberOfProblemsFieldFillInTheBlank = screen.getByTestId(
      `number-of-problems-field-${ProblemType.FILL_IN_THE_BLANK}`
    ) as HTMLInputElement;

    // to test the inputs are required and have default values before any user events.
    expect(numberOfProblemsFieldReorder).toBeInvalid();
    expect(numberOfProblemsFieldMultipleChoice).toBeInvalid();
    expect(numberOfProblemsFieldFillInTheBlank).toBeInvalid();
    expect(problemSetNameField).toBeInvalid();
  });

  test('show error toast when the form is submitted without choosing at least one ppalm problem type to generate.', async () => {
    setup(defaultProps);

    const problemSetNameField = screen.getByTestId(
      'problemset-name-field'
    ) as HTMLInputElement;

    // inflate the problem set name field with valid values
    await userEvent.type(problemSetNameField, 'Example name');

    const submitBttn = screen.getByTestId('submit-bttn') as HTMLInputElement;

    await userEvent.click(submitBttn);

    // test to see if toast gets triggered when both reorder, mutliple choice and fill in the blank checkboxes are not ticked and submit button is clicked
    expect(toast.error).toBeCalledTimes(1);
  });

  test('Form should successfully submit and navigate to the next step when all inputs are valid.', async () => {
    setup(defaultProps);

    const problemSetNameField = screen.getByTestId(
      'problemset-name-field'
    ) as HTMLInputElement;

    // inflate problem set name field with valid name
    await userEvent.type(problemSetNameField, 'Example name');

    const reorderCheckbox = screen.getByTestId(
      'reorder-checkbox'
    ) as HTMLInputElement;
    const multipleChoiceCheckbox = screen.getByTestId(
      'multiple-choice-checkbox'
    ) as HTMLInputElement;
    const fillInTheBlankCheckbox = screen.getByTestId(
      'fill-in-the-blank-checkbox'
    ) as HTMLInputElement;

    await userEvent.click(multipleChoiceCheckbox);
    await userEvent.click(reorderCheckbox);
    await userEvent.click(fillInTheBlankCheckbox);

    // number of problems fields for each problem type only appear if they are selected
    const numberOfProblemsFieldReorder = screen.getByTestId(
      `number-of-problems-field-${ProblemType.REORDER}`
    ) as HTMLInputElement;

    const numberOfProblemsFieldMultipleChoice = screen.getByTestId(
      `number-of-problems-field-${ProblemType.MULTIPLE_CHOICE}`
    ) as HTMLInputElement;

    const numberOfProblemsFieldFillInTheBlank = screen.getByTestId(
      `number-of-problems-field-${ProblemType.FILL_IN_THE_BLANK}`
    ) as HTMLInputElement;

    // inflate the number of problems field for each problem type with valid values
    await userEvent.type(numberOfProblemsFieldReorder, '10');
    await userEvent.type(numberOfProblemsFieldMultipleChoice, '10');
    await userEvent.type(numberOfProblemsFieldFillInTheBlank, '10');

    const submitBttn = screen.getByTestId('submit-bttn') as HTMLInputElement;

    await userEvent.click(submitBttn);

    // test to see that error toast was not called when at all the required fields where filled.
    expect(toast.error).toBeCalledTimes(0);
  });
});
