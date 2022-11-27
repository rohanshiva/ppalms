import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { cleanup, render, screen } from '@testing-library/react';
import FilePicker from '../renderer/components/FilePicker';
import { toast } from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockInvalidFileContent = `
    !!! NOT VALID !!!        
`;

const mockInvalidFileBlob = new Blob([mockInvalidFileContent]);

const mockValidFileContent = `
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root_handler(): 
    return {"msg": "👋🏿"}
`;

const mockValidFileBlob = new Blob([mockValidFileContent]);

afterEach(() => {
  jest.resetAllMocks();
  cleanup();
});

describe('FilePicker', () => {
  test('upload file', async () => {
    const filename = 'valid_file.py';
    const fileType = 'text/x-python';
    const file = new File([mockValidFileBlob], filename, { type: fileType });
    render(<FilePicker />);
    const filePickerButton = screen.getByTestId(
      'file-picker-btn'
    ) as HTMLInputElement;
    await userEvent.upload(filePickerButton, file);
    expect(filePickerButton.files!.length).toEqual(1);
    expect(filePickerButton.files![0].name).toEqual(filename);
  });
  test('show an error when a file is picked with an invalid extension', async () => {
    const invalidFilename = 'invalid_file.md';
    const invalidFileType = 'text/markdown';
    const file = new File([mockInvalidFileBlob], invalidFilename, {
      type: invalidFileType,
    });
    render(<FilePicker />);
    const filePickerButton = screen.getByTestId(
      'file-picker-btn'
    ) as HTMLInputElement;
    await userEvent.upload(filePickerButton, file);

    expect(filePickerButton.files!.length).toEqual(1);
    expect(filePickerButton.files![0].name).toEqual(invalidFilename);

    const nextButton = screen.getByTestId('navigate-to-select-line-tuples-btn');
    await userEvent.click(nextButton);

    // an error toast will be shown if an invalid file is picked
    expect(toast.error).toHaveBeenCalled();
  });

  test('submit valid file', async () => {
    const validFilename = 'valid_file.py';
    const validFile = new File([mockValidFileBlob], 'valid_file.py');

    render(<FilePicker />);
    const filePickerButton = screen.getByTestId(
      'file-picker-btn'
    ) as HTMLInputElement;
    await userEvent.upload(filePickerButton, validFile);

    expect(filePickerButton.files!.length).toEqual(1);
    expect(filePickerButton.files![0].name).toEqual(validFilename);

    const nextButton = screen.getByTestId('navigate-to-select-line-tuples-btn');
    await userEvent.click(nextButton);

    // an error toast will not pop up if a valid file is picked
    expect(toast.error).not.toHaveBeenCalled();
  });
});
