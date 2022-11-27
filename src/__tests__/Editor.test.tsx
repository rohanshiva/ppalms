import '@testing-library/jest-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Editor from '../renderer/components/Editor';
import { toast } from 'react-hot-toast';


const reactSourceCode = `
import React, { useState } from "react";

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
`.trim();

jest.mock('react-hot-toast', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }));


const historyReplaceMock = jest.fn((path, state) => {})

jest.mock('react-router-dom', () => ({
    useHistory:() => {
        return {
            replace: historyReplaceMock
        }
    }
}));

describe('Editor', () => {
  const reactSourceCodeLength = reactSourceCode.split('\n').length;

  const wrapEditorProps = (props: any) => {
    return {
      location: {
        state: props,
      },
    };
  };

  const ensureEditorRendersSourceCode = (sourceCode: string) => {
    const expectedLines = sourceCode.split('\n');
    expectedLines.forEach((value, index) => {
      const actualLine = screen.getByTestId(`${index}-content`);
      expect(actualLine.textContent?.trim()).toBe(value.trim());
    });
  };

  const ensureLinesHighlighted = (
    expectedHighlightLines: number[],
    totalLines: number
  ) => {
    expectedHighlightLines.forEach((val) => {
      const actualLine = screen.getByTestId(`${val}-content`);
      expect(actualLine.classList).toContain('highlighted');
    });

    spread(0, totalLines - 1)
      .filter((val) => !expectedHighlightLines.includes(val))
      .forEach((val) => {
        const actualLine = screen.getByTestId(`${val}-content`);
        expect(actualLine.classList).not.toContain('highlighted');
      });
  };

  const ensurePreHighlightLineToggled = (line: number, totalLines: number) => {
    const actualLine = screen.getByTestId(`${line}-content`);
    expect(actualLine.classList).toContain('prehighlight-selection');

    ensureLinesNotPreHighlightToggled(
      spread(0, totalLines - 1).filter((val) => val !== line)
    );
  };

  const ensureLinesNotPreHighlightToggled = (
    expectedNotToggledLines: number[]
  ) => {
    expectedNotToggledLines.forEach((val) => {
      const actualLine = screen.getByTestId(`${val}-content`);
      expect(actualLine.classList).not.toContain('prehighlight-selection');
    });
  };

  const ensureRemoveOptionsOnLines = (
    expectedRemoveOptionLines: number[],
    totalLines: number
  ) => {
    expectedRemoveOptionLines.forEach((val) => {
      const actualLine = screen.getByTestId(`${val}-remove`);
      expect(actualLine).not.toBeNull();
    });

    spread(0, totalLines - 1)
      .filter((val) => !expectedRemoveOptionLines.includes(val))
      .forEach((val) => {
        expect(() => {
          screen.getByTestId(`${val}-remove`);
        }).toThrow();
      });
  };

  const spread = (start: number, end: number) => {
    let arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  };

  describe('Render with props', () => {
    test("render with 'state' props", () => {
      render(<Editor {...wrapEditorProps({ code: reactSourceCode })} />);
      ensureEditorRendersSourceCode(reactSourceCode);
      ensureLinesHighlighted([], reactSourceCodeLength);

      ensureLinesNotPreHighlightToggled(spread(0, reactSourceCodeLength - 1));
      ensureRemoveOptionsOnLines([], reactSourceCodeLength);
    });

    test("render with 'previous state' props", () => {
      const props = {
        prevProps: {
          code: reactSourceCode,
        },
        prevState: {
          lineTuples: [
            {
              start: 1,
              end: 5,
            },
            {
              start: 7,
              end: 7,
            },
          ],
          lineTupleStart: 8,
        },
      };
      render(<Editor {...wrapEditorProps(props)} />);
      ensureEditorRendersSourceCode(reactSourceCode);
      ensureLinesHighlighted([...spread(1, 5), 7], reactSourceCodeLength);

      ensurePreHighlightLineToggled(8, reactSourceCodeLength);
      ensureRemoveOptionsOnLines([1, 7], reactSourceCodeLength);
    });
  });

  describe('LineTuple CRUD', () => {
    test.each([
      {
        testType:
          'multi-line line tuple creation where line tuple start < line tuple end',
        start: 2,
        end: 6,
      },
      {
        testType:
          'multi-line line tuple creation where line tuple start > line tuple end',
        start: 5,
        end: 2,
      },
      { testType: 'single-line line tuple creation', start: 4, end: 4 },
      {
        testType: 'line tuple creation for all source code',
        start: 0,
        end: reactSourceCodeLength - 1,
      },
    ])('create LineTuple $testType', ({ start, end }) => {
      render(<Editor {...wrapEditorProps({ code: reactSourceCode })} />);

      const startLine = screen.getByTestId(`${start}-toggle`);

      fireEvent.click(startLine);
      ensurePreHighlightLineToggled(start, reactSourceCodeLength);
      ensureLinesHighlighted([], reactSourceCodeLength);
      ensureRemoveOptionsOnLines([], reactSourceCodeLength);

      const endLine = screen.getByTestId(`${end}-toggle`);

      fireEvent.click(endLine, { shiftKey: true });
      ensureLinesHighlighted(
        [...spread(Math.min(start, end), Math.max(start, end))],
        reactSourceCodeLength
      );
      ensureLinesNotPreHighlightToggled(spread(0, reactSourceCodeLength - 1));
      ensureRemoveOptionsOnLines([Math.min(start, end)], reactSourceCodeLength);
    });

    test('delete LineTuple', () => {
      render(<Editor {...wrapEditorProps({ code: reactSourceCode })} />);

      const startLine = screen.getByTestId('0-toggle');
      fireEvent.click(startLine);

      const endLine = screen.getByTestId('5-toggle');
      fireEvent.click(endLine, { shiftKey: true });

      ensureLinesHighlighted([...spread(0, 5)], reactSourceCodeLength);
      ensureRemoveOptionsOnLines([0], reactSourceCodeLength);

      const removeToggle = screen.getByTestId('0-remove');
      fireEvent.click(removeToggle)

      ensureLinesHighlighted([], reactSourceCodeLength);
      ensureRemoveOptionsOnLines([], reactSourceCodeLength);
      ensureLinesNotPreHighlightToggled(spread(0, reactSourceCodeLength - 1));
    });

    test('toggle line pre-highlight', () => {
      render(<Editor {...wrapEditorProps({ code: reactSourceCode })} />);

      let startLine = screen.getByTestId('0-toggle');
      fireEvent.click(startLine);

      ensurePreHighlightLineToggled(0, reactSourceCodeLength);
      ensureLinesHighlighted([], reactSourceCodeLength);

      startLine = screen.getByTestId('5-toggle');
      fireEvent.click(startLine);

      ensurePreHighlightLineToggled(5, reactSourceCodeLength);
      ensureLinesHighlighted([], reactSourceCodeLength);
    });
  });

  describe('LineTuple submission', () => {
    afterEach(() => {
        jest.resetAllMocks();
        cleanup();
    })

    test('submit with no tuples grouped', () => {
        render(<Editor {...wrapEditorProps({ code: reactSourceCode })} />);
        fireEvent.click(screen.getByTestId("line-tuples-submit"));
        expect(toast.error).toBeCalledTimes(1);

        fireEvent.click(screen.getByTestId("0-toggle"));
        fireEvent.click(screen.getByTestId("line-tuples-submit"));
        expect(toast.error).toBeCalledTimes(2);

    });

    test('submit with tuples grouped', () => {
        render(<Editor {...wrapEditorProps({ code: reactSourceCode })} />);

        fireEvent.click(screen.getByTestId("1-toggle"));
        fireEvent.click(screen.getByTestId("5-toggle"), {shiftKey: true});

        fireEvent.click(screen.getByTestId("line-tuples-submit"));
        expect(toast.error).not.toHaveBeenCalled();

        const lines = reactSourceCode.split("\n");

        const expectedState = {
            codeLines: spread(1, 5).map(val => lines[val]),
            lineTuples: [{start: 0, end: 4}],
            editorState: {
                lineTuples: [{start: 1, end: 5}],
                lineTupleStart: null,
            },
            editorProps: { code: reactSourceCode },
        }

        expect(historyReplaceMock).lastCalledWith("/form", expectedState)
    });
  });
});
