import { useState, useEffect } from 'react';
import {toast} from 'react-hot-toast';
import { ProblemSetGenerator } from '../../api/ProblemSetGenerator';
import { ProblemType } from 'interface';
import { useHistory } from 'react-router-dom';

const GenerationForm = (props: any) => {
  const history = useHistory();
  const [isReordering, setIsReordering] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [numberOfProblems, setNumberOfProblems] = useState<number>(0);
  const [problemSetName, setProblemSetName] = useState('');
  const { codeLines, lineTuples } = props.location.state;

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
              prevState: props.location.state.editorState,
              prevProps: props.location.state.editorProps,
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
