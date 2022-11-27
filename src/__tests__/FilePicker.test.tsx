import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import FilePicker from '../renderer/components/FilePicker';

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

describe('FilePicker', () => {
  test('file picker', async () => {
    const filename = 'valid_file.py';
    const fileType = 'text/x-python';
    const file = new File([mockValidFileBlob], filename, { type: fileType });
    render(<FilePicker />);
    const filePickerButton = screen.getByTestId(
      'file-picker-btn'
    ) as HTMLInputElement;
    await userEvent.upload(filePickerButton, file);
    // @ts-ignore
    expect(filePickerButton.files!.length).toEqual(1);
    expect(filePickerButton.files![0].name).toEqual(filename);
  });
});
