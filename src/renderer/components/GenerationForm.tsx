import { useState, useEffect } from 'react';
import {toast} from 'react-hot-toast';
import { ProblemSetGenerator } from '../../api/ProblemSetGenerator';
import { ProblemType } from 'interface';
import { Link, useHistory } from 'react-router-dom';

const Padder = (props: any) => {
  return <div style={{ paddingBottom: props.paddingBottom }}></div>;
};

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
      <Link to="/">
        <button>🏠</button>
      </Link>
      <button
        style={{ marginLeft: '1rem' }}
        onClick={() =>
          history.replace('/select-lines', {
            prevState: props.location.state.editorState,
            prevProps: props.location.state.editorProps,
          })
        }
      >
        👈🏿
      </button>
      <h1> Generation Form</h1>
      <form onSubmit={formHandler}>
        <label>What types of problems would you like to generate?</label>
        <Padder paddingBottom={'10px'} />
        <label>
          Re-ordering:
          <input
            style={{ paddingTop: '20px' }}
            name="isReordering"
            data-testid= "reorder-checkbox"
            type="checkbox"
            checked={isReordering}
            onChange={() => setIsReordering(!isReordering)}
          />
        </label>
        <Padder paddingBottom={'5px'} />
        <label>
          Multiple Choice:
          <input
            name="isMultipleChoice"
            data-testid= "multiple-choice-checkbox"
            type="checkbox"
            checked={isMultipleChoice}
            onChange={() => setIsMultipleChoice(!isMultipleChoice)}
          />
        </label>
        <Padder paddingBottom={'20px'} />
        <label>How many problems do you want to generate?</label>
        <Padder paddingBottom={'10px'} />
        <input
          required
          name="numberOfProblems"
          data-testid = "problems-field"
          type="number"
          value={numberOfProblems}
          min={1}
          onChange={(event) =>
            setNumberOfProblems(parseInt(event.target.value))
          }
        />
        <Padder paddingBottom={'20px'} />

        <label>What do you want to name your problem set?</label>
        <Padder paddingBottom={'10px'} />
        <input
          required
          name="problemSetName"
          data-testid = "problemset-name-field"
          type="text"
          value={problemSetName}
          onChange={(event) => setProblemSetName(event.target.value)}
        />
        <Padder paddingBottom={'20px'} />
        <button data-testid="submit-bttn" type="submit">Generate</button>
      </form>
    </div>
  );
};

export default GenerationForm;
