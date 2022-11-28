import { useState } from 'react';
import {toast} from 'react-hot-toast';
import { ProblemSetGenerator } from '../../api/ProblemSetGenerator';
import { ProblemType } from 'interface';
import { useHistory } from 'react-router-dom';

/**
 * Form component to configure the generation process. Lets the user specify options such as
 * the type of problems to generate, the max number of problems and the problem set's name.
 * @param props
 *  - codeLines : the filtered code lines the user selected.
 *  - lineTuples : the line tuples for the selected code lines.
 * @returns {HTML} the HTML tree of the Generation Form component
 */
const GenerationForm = (props: any) => {
  const history = useHistory();
  const [isReordering, setIsReordering] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [numberOfProblems, setNumberOfProblems] = useState<number>(0);
  const [problemSetName, setProblemSetName] = useState('');
  const { codeLines, lineTuples } = props.location.state;

   
  /**
   * Utility function to return the selected problem types.
   * @returns {ProblemType[]} an array of the selected problem types.
   */
  const getSelectedProblemTypes = () => {
    let problemTypes: ProblemType[] = [];
    if (isReordering) {
      problemTypes.push(ProblemType.REORDER);
    }
    if (isMultipleChoice) {
      problemTypes.push(ProblemType.MULTIPLE_CHOICE);
    }
    return problemTypes;
  };

  /**
   * Handler function to validate form, gets triggered on each submit.
   * If the form has all the required inputs, the {@link ProblemSetGenerator} is called and the problem set is generated. 
   * Then, the user is redirected to the problem set result screen. 
   * @param event the form submit trigger event
   * @returns {null}
   */
  const formHandler = (event: any) => {
    event.preventDefault();
    if (!isReordering && !isMultipleChoice) {
      toast.error('At least one type of problem must be chosen.');
      return;
    }
    const problemSet = ProblemSetGenerator.generate(
      getSelectedProblemTypes(),
      codeLines.join('\n'),
      lineTuples,
      numberOfProblems,
      problemSetName
    );
    history.replace('/result', { problemSet });
  };

  return (
    <div>
      <div className="nav-btns">
        <button
          onClick={(e) => {
            history.replace('/');
          }}
        >
          🏠
        </button>
        <button
          onClick={() =>
            history.replace('/select-lines', {
              prevState: props.location.state.linePickerState,
              prevProps: props.location.state.linePickerProps,
            })
          }
        >
          👈🏿
        </button>
      </div>
      <h1> Generation Form</h1>
      <form onSubmit={formHandler}>
        <div className="question">
          <label>What types of problems would you like to generate?</label>
          <label>
            Re-ordering:
            <input
              data-testid= "reorder-checkbox"
              name="isReordering"
              type="checkbox"
              checked={isReordering}
              onChange={() => setIsReordering(!isReordering)}
            />
          </label>
          <label>
            Multiple Choice:
            <input
              data-testid= "multiple-choice-checkbox"
              name="isMultipleChoice"
              type="checkbox"
              checked={isMultipleChoice}
              onChange={() => setIsMultipleChoice(!isMultipleChoice)}
            />
          </label>
        </div>
        <div className="question">
          <label>How many problems do you want to generate?</label>
          <input
            data-testid = "problems-field"
            required
            min={1}
            name="numberOfProblems"
            type="number"
            value={numberOfProblems}
            onChange={(event) =>
              setNumberOfProblems(parseInt(event.target.value))
            }
          />
        </div>
        <div className="question">
          <label>What do you want to name your problem set?</label>
          <input
            required
            data-testid = "problemset-name-field"
            name="numberOfProblems"
            type="text"
            value={problemSetName}
            onChange={(event) => setProblemSetName(event.target.value)}
          />
        </div>
        <button data-testid = "submit-bttn" type="submit">Generate</button>
      </form>
    </div>
  );
};

export default GenerationForm;
