import { useState } from 'react';
import toast from 'react-hot-toast';
import { ProblemSetGenerator } from '../../api/ProblemSetGenerator';
import { ProblemType } from 'interface';

const Padder = (props: any) => {
  return <div style={{ paddingBottom: props.paddingBottom }}></div>;
};

const GenerationForm = (props: any) => {
  const [isReordering, setIsReordering] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [numberOfProblems, setNumberOfProblems] = useState<number>(10);
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
    if (!isReordering && !isMultipleChoice) {
      toast.error('At least one type of problem must be chosen.');
    }
    event.preventDefault();
    const problemSet = ProblemSetGenerator.generate(
      getSelectedProblemTypes(),
      codeLines.join("\n"),
      lineTuples,
      numberOfProblems,
      problemSetName
    );
    console.log(problemSet);
  };

  return (
    <div>
      <h1> Generation Form</h1>
      <form onSubmit={formHandler}>
        <label>What types of problems would you like to generate?</label>
        <Padder paddingBottom={'10px'} />
        <label>
          Re-ordering:
          <input
            style={{ paddingTop: '20px' }}
            name="isReordering"
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
          type="number"
          value={numberOfProblems}
          onChange={(event) =>
            setNumberOfProblems(parseInt(event.target.value))
          }
        />
        <Padder paddingBottom={'20px'} />

        <label>What do you want to name your problem set?</label>
        <Padder paddingBottom={'10px'} />
        <input
          required
          name="numberOfProblems"
          type="text"
          value={problemSetName}
          onChange={(event) => setProblemSetName(event.target.value)}
        />
        <Padder paddingBottom={'20px'} />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
};

export default GenerationForm;
