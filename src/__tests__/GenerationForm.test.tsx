import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import GenerationForm from 'renderer/components/GenerationForm';

import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import { doesNotMatch } from 'assert';

import {toast} from 'react-hot-toast';
import exp from 'constants';

jest.mock('react-hot-toast', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
}));

describe('GenerationForm', () => {
  test('form not being able to submit until all the required inputs have been satisfied', async () => {
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

    const history = createMemoryHistory()


    render(  <Router history={history}>
        <GenerationForm {...props}/>
    </Router>);

    const numberOfProblemsField = screen.getByTestId(
      'problems-field'
    ) as HTMLInputElement;

    const problemSetNameField = screen.getByTestId(
      'problemset-name-field'
    ) as HTMLInputElement;

    // to test the inputs are required and have default values before any user events.
    expect(numberOfProblemsField).toBeInvalid();
    expect(problemSetNameField).toBeInvalid();


    // inflate the number of problems field and problem set name field with valid values
    await userEvent.type(numberOfProblemsField, '10');
    await userEvent.type(problemSetNameField, 'Example name');


    const reorderCheckbox = screen.getByTestId('reorder-checkbox') as HTMLInputElement;
    const multipleChoiceCheckbox = screen.getByTestId('multiple-choice-checkbox') as HTMLInputElement;

    const submitBttn = screen.getByTestId('submit-bttn') as HTMLInputElement;

    
    await userEvent.click(submitBttn);

    // test to see if toast gets triggered when both reorder and mutliple choice checkboxes are not ticked and submit button is clicked
    expect(toast.error).toBeCalledTimes(1);

    //await userEvent.click(multipleChoiceCheckbox);
    //await userEvent.click(reorderCheckbox);

    await userEvent.click(submitBttn);


    // test to see that toast was not called again when at least checkbox was clicked
    expect(toast.error).toBeCalledTimes(1);
    
  });
});
