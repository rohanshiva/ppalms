import { useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

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

const getFileExtension = (filename: string) => {
  return `.${filename.split('.')[1]}`;
};

function FilePicker() {

  const history = useHistory();
  const [pickedFile, setPickedFile] = useState<any>();

  const pickHandler = (event: any) => {
    setPickedFile(event.target.files[0]);
  };

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
      console.log(event.target?.result);
      history.replace('/select-lines', {code: event.target?.result});
    });
    reader.readAsText(pickedFile);
  };

  return (
    <>
      <h2>Pick a file to generate PPALMS problems</h2>
      <div className="file-picker-btns">
        <input
          type="file"
          name="file"
          id="file"
          onChange={pickHandler}
          title="Pick a file"
        />
        <div>
          <button onClick={validateFile}>Next</button>
        </div>
      </div>
    </>
  );
}

export default FilePicker;
