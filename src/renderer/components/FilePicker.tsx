import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

/**
 * Supported file extensions
 */
const supportedExtensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.go',
  '.py',
  '.java',
  '.html',
  '.c',
  '.cpp',
];

/**
 * @param filename the name of the file
 * @returns file extension from the given param (filename)
 */
const getFileExtension = (filename: string) => {
  return `.${filename.split('.')[1]}`;
};

/**
 * FilePicker component is responsible for rendering an interface for the user to pick a file
 * from their filesystem and navigate to line selection screen if the picked file is valid.
 * @param props
 *  - pickedFile : state variable that tracks the file that user picked
 * @returns the HTML tree of the Editor component
 */
function FilePicker(props: any) {
  const history = useHistory();
  const [pickedFile, setPickedFile] = useState<any>();

  /**
   * Runs whenever user picks a file and updates the state variable (pickedFile) with the picked file metdata
   * @param e event data for file upload button
   */
  const pickHandler = (e: any) => {
    setPickedFile(e.target.files[0]);
  };

  // used to manage the state when the component renders
  useEffect(() => {
    if (
      props.location !== undefined &&
      props.location.state &&
      props.location.state.prevState
    ) {
      let pickedFile = props.location.state.prevState.pickedFile;
      setPickedFile(pickedFile);
    }
  }, []);

  /**
   * Runs when the user clicks on next button.
   *  - Shows an error toast to the user if they haven't picked a file.
   *  - Shows an error toast if the picked file is invalid.
   * Navigates the user to line selection screen (Editor component) with the picked file content
   */
  const validateFile = () => {
    if (!pickedFile) {
      toast.error('Please select a file before moving onto the next step.');
      return;
    }
    if (!supportedExtensions.includes(getFileExtension(pickedFile.name))) {
      toast.error(
        'Invalid file. Please select a file with these extensions: ' +
          supportedExtensions.join(', ')
      );
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      history.replace('/select-lines', {
        code: event.target?.result,
        filePickerState: { pickedFile: pickedFile },
      });
    });
    reader.readAsText(pickedFile);
  };

  return (
    <>
      <button
        onClick={() => {
          history.replace('/');
        }}
      >
        👈🏿
      </button>

      <h1>Generate</h1>
      <h2>Pick a file to generate PPALMS problems</h2>
      <div className="file-picker-btns">
        <input
          data-testid="file-picker-btn"
          type="file"
          name="file"
          id="file"
          onChange={pickHandler}
          title="Pick a file"
        />
        <div>
          <button
            data-testid="navigate-to-select-line-tuples-btn"
            onClick={validateFile}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default FilePicker;
