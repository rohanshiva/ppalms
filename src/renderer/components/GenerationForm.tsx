import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ProblemSetGenerator } from '../../api/ProblemSetGenerator';
import { ProblemType, ProblemTypes } from 'interface';
import { useHistory } from 'react-router-dom';

/**
 * Type to represent the state variable problemTypesConfig, which contains config
 * information for each problem type such as number of problems, and selected status.
 */
type ProblemTypesConfig = {
  [key in ProblemType]: {
    selected: boolean;
    numberOfProblems: number;
  };
};

/**
 *
 * @returns a base configuration for each problem type
 */
const getBaseProblemTypesConfig = () => {
  let problemTypesConfig: ProblemTypesConfig = {
    [ProblemType.REORDER]: {
      selected: false,
      numberOfProblems: 0,
    },
    [ProblemType.MULTIPLE_CHOICE]: {
      selected: false,
      numberOfProblems: 0,
    },
    [ProblemType.FILL_IN_THE_BLANK]: {
      selected: false,
      numberOfProblems: 0,
    },
  };
  return problemTypesConfig;
};

/**
 *
 * @param type
 * @returns a string representation of the provided problem type
 */
const problemTypeToString = (type: ProblemType) => {
  switch (type) {
    case ProblemType.REORDER:
      return 'Reorder';
    case ProblemType.MULTIPLE_CHOICE:
      return 'Multiple Choice';
    case ProblemType.FILL_IN_THE_BLANK:
      return 'Fill In The Blank';
  }
};

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
  // problemTypesConfig contains configuration for each problem type such as number of problems and the selected status
  const [problemTypesConfig, setProblemTypesConfig] =
    useState<ProblemTypesConfig>(getBaseProblemTypesConfig());
  const [problemSetName, setProblemSetName] = useState('');
  const { codeLines, lineTuples } = props.location.state;

  /**
   * Utility function to return the selected problem types.
   * @returns {ProblemType[]} an array of the selected problem types.
   */
  const getSelectedProblemTypes = () => {
    let problemTypes: ProblemType[] = [];
    for (const type of ProblemTypes) {
      if (problemTypesConfig[type].selected) {
        problemTypes.push(type);
      }
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
    const isReorderingSelected =
      problemTypesConfig[ProblemType.REORDER].selected;

    const isMultipleChoiceSelected =
      problemTypesConfig[ProblemType.MULTIPLE_CHOICE].selected;

    if (!isReorderingSelected && !isMultipleChoiceSelected) {
      toast.error('At least one type of problem must be chosen.');
      return;
    }

    const problemSet = ProblemSetGenerator.generate(
      getSelectedProblemTypes(),
      codeLines.join('\n'),
      lineTuples,
      10,
      problemSetName
    );

    history.replace('/result', { problemSet });
  };

  /**
   * Toggles the selected status of the provided problem type in problemTypesConfig
   * @param checked selected status
   * @param type problem type to toggle
   */
  const toggleProblemType = (checked: boolean, type: ProblemType) => {
    setProblemTypesConfig((prevProblemTypesConfig: ProblemTypesConfig) => ({
      ...prevProblemTypesConfig,
      ...{
        [type]: {
          selected: checked,
          numberOfProblems: prevProblemTypesConfig[type].numberOfProblems,
        },
      },
    }));
  };

  /**
   * Updates the problemTypesConfig with the provided numberOfProblems for the provided problem type
   * @param numberOfProblems new number of problems for the provided problem type (param type)
   * @param type problem type for the number of problems update
   */
  const updateNumberOfProblems = (
    numberOfProblems: number,
    type: ProblemType
  ) => {
    setProblemTypesConfig((prevProblemTypesConfig: ProblemTypesConfig) => ({
      ...prevProblemTypesConfig,
      ...{
        [type]: {
          selected: prevProblemTypesConfig[type].selected,
          numberOfProblems: numberOfProblems,
        },
      },
    }));
  };

  return (
    <div>
      <div className="nav-btns">
        <button
          onClick={(e: any) => {
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
              data-testid="reorder-checkbox"
              name="isReordering"
              type="checkbox"
              checked={problemTypesConfig[ProblemType.REORDER].selected}
              onChange={(event: { target: { checked: boolean } }) =>
                toggleProblemType(event.target.checked, ProblemType.REORDER)
              }
            />
          </label>
          <label>
            Multiple Choice:
            <input
              data-testid="multiple-choice-checkbox"
              name="isMultipleChoice"
              type="checkbox"
              checked={problemTypesConfig[ProblemType.MULTIPLE_CHOICE].selected}
              onChange={(event: { target: { checked: boolean } }) =>
                toggleProblemType(
                  event.target.checked,
                  ProblemType.MULTIPLE_CHOICE
                )
              }
            />
          </label>
          <label>
            Fill In The Blank:
            <input
              data-testid="fill-in-the-blank-checkbox"
              name="isFillInTheBlank"
              type="checkbox"
              checked={
                problemTypesConfig[ProblemType.FILL_IN_THE_BLANK].selected
              }
              onChange={(event: { target: { checked: boolean } }) =>
                toggleProblemType(
                  event.target.checked,
                  ProblemType.FILL_IN_THE_BLANK
                )
              }
            />
          </label>
        </div>
        {ProblemTypes.map((type) => {
          if (problemTypesConfig[type].selected) {
            return (
              <div className="question" key={type}>
                <label>
                  How many {problemTypeToString(type)} type problems do you want
                  to generate?
                </label>
                <input
                  data-testid={`number-of-problems-field-${type}`}
                  required
                  min={1}
                  name="numberOfProblems"
                  type="number"
                  value={problemTypesConfig[type].numberOfProblems}
                  onChange={(event: { target: { value: string } }) =>
                    updateNumberOfProblems(parseInt(event.target.value), type)
                  }
                />
              </div>
            );
          }
        })}
        <div className="question">
          <label>What do you want to name your problem set?</label>
          <input
            required
            data-testid="problemset-name-field"
            name="numberOfProblems"
            type="text"
            value={problemSetName}
            onChange={(event: { target: { value: any } }) =>
              setProblemSetName(event.target.value)
            }
          />
        </div>
        <button data-testid="submit-bttn" type="submit">
          Generate
        </button>
      </form>
    </div>
  );
};

export default GenerationForm;
