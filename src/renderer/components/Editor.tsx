import { useEffect, useState } from 'react';
import {
  Pre,
  Line,
  LineNo,
  LineNoDiv,
  LineContent,
  LineAction,
  LineActionDiv,
} from './EditorStyle';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github';
import { useHistory } from 'react-router-dom';
import { LineTuple } from '../../interface';
import toast from 'react-hot-toast';

/**
 * Editor component is responsible for rendering the user selected code file, and providing
 * an interface for users to cherry-pick lines and line-tuples to generate problem sets.
 * @param props
 *  - code : the code from the user selected file to render
 *  - lineTuples : user selected lineTuples
 *  - lineTupleStart: tracks the line that is in pre-highlight stage
 * @returns the HTML tree of the Editor component
 */
const Editor = (props: any) => {
  const [lineTuples, setLineTuples] = useState<LineTuple[]>([]);
  const [lineTupleStart, setLineTupleStart] = useState<number | null>(null);
  const [code, setCode] = useState<string>('');
  const history = useHistory();

  // used to manage the state when the component renders
  useEffect(() => {
    if (props.location.state.code) {
      setCode(props.location.state.code);
    }

    if (props.location.state.prevProps) {
      setCode(props.location.state.prevProps.code);
    }

    if (props.location.state && props.location.state.prevState) {
      let lineTuples = props.location.state.prevState.lineTuples;
      let lineTupleStart = props.location.state.prevState.lineTupleStart;

      setLineTuples(lineTuples);
      setLineTupleStart(lineTupleStart);
    }
  }, []);

  /**
   * Utility function to check if the given line param (i) is part of an existing line-tuple
   * @param i line number
   * @returns true if the param (i) is part of any of the line tuples selected by the user
   */
  const isPartOfLineTuple = (i: number) => {
    return (
      lineTuples.filter(({ start, end }) => i >= start && i <= end).length > 0
    );
  };

  /**
   * Utility function to check if the given line number param (i) is pre-highlighted
   * @param i line number
   * @returns true if the param (i) is pre-highlighted
   */
  const isPreHighlightToggled = (i: number) => {
    return lineTupleStart === i;
  };

  /**
   * Runs whenever a line is clicked, it updates the state variables
   * with the appropriate line/line-tuple depending on the event interactions
   * @param e line click event data
   * @param i line number that was clicked
   */
  const handleLineClick = (e: any, i: number) => {
    if (isPartOfLineTuple(i)) {
      return;
    }

    if (lineTupleStart == null) {
      setLineTupleStart(i);
    } else {
      // line is clicked with shift key
      if (e.shiftKey) {
        setLineTuples((lt) => [
          ...lt,
          {
            start: Math.min(lineTupleStart, i),
            end: Math.max(i, lineTupleStart),
          },
        ]);
        setLineTupleStart(null);
      } else {
        setLineTupleStart(i);
      }
    }
  };

  /**
   * Utility function that checks if the given line number param (i) is the start of any of the existing line-tuples
   * @param i line number
   * @returns true if any of the line tuples start with the line number provided as the param (i)
   */
  const isStart = (i: number) => {
    return lineTuples.filter(({ start, end }) => i === start).length > 0;
  };

  /**
   * Removes the associated line-tuple from the state
   * @param e line tuple delete button click event data
   * @param i line number
   */
  const handleRemove = (e: any, i: number) => {
    setLineTuples((lt) => [...lt.filter(({ start, end }) => i !== start)]);
  };

  /**
   * @param i line number
   * @returns the CSS class for a line depending on the its state
   */
  const getLineClass = (i: number) => {
    if (isPartOfLineTuple(i)) {
      return 'highlighted';
    } else if (isPreHighlightToggled(i)) {
      return 'prehighlight-selection';
    }
    return '';
  };

  /**
   * Removes unselected lines and navigates the user to generation configuration form
   * @param e next button click event data
   */
  const onHighlightFinish = (e: any) => {
    if (lineTuples.length == 0) {
      toast.error('Please select some lines before proceeding.');
      return;
    }

    let prevlineTuples = [...lineTuples];
    let prevLineTupleStart = lineTupleStart;

    const codeLines = code.split('\n');

    // filter only the lines that were selected by the user
    let filteredCodeLines: string[] = [];
    let lineTuplesForFilteredCode: LineTuple[] = [];

    lineTuples.sort((a: LineTuple, b: LineTuple) => {
      return a.start - b.start;
    });

    let newTupleStart = 0;
    lineTuples.forEach(({ start, end }) => {
      const length = end - start;
      for (let i = start; i <= end; i++) {
        filteredCodeLines.push(codeLines[i]);
      }

      const newTupleEnd = newTupleStart + length;
      lineTuplesForFilteredCode.push({
        start: newTupleStart,
        end: newTupleEnd,
      });
      newTupleStart = newTupleEnd + 1;
    });

    history.replace('/form', {
      codeLines: filteredCodeLines,
      lineTuples: lineTuplesForFilteredCode,
      editorState: {
        lineTuples: prevlineTuples,
        lineTupleStart: prevLineTupleStart,
      },
      editorProps: { code: code },
    });
  };

  return (
    <>
      <div>
        <button
          onClick={(e) => {
            history.replace('/');
          }}
        >
          🏠
        </button>
        <button
          style={{ marginLeft: '1rem' }}
          onClick={() =>
            history.replace('/generate', {
              prevState: props.location.state.filePickerState,
            })
          }
        >
          👈🏿
        </button>
      </div>
      <h3>Please select lines to generate problems.</h3>
      <div>
        Use <kbd>(shift+select)</kbd> to select line tuples.
      </div>
      <Highlight {...defaultProps} theme={theme} code={code} language="jsx">
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <Pre className={className} style={style}>
              {tokens.map((line, i) => (
                <Line key={i} {...getLineProps({ line, key: i })}>
                  <LineActionDiv>
                    {isStart(i) && (
                      <LineAction onClick={(e) => handleRemove(e, i)}>
                        ❌
                      </LineAction>
                    )}
                  </LineActionDiv>
                  <LineNoDiv>
                    <LineNo onClick={(e) => handleLineClick(e, i)}>
                      {i + 1}
                    </LineNo>
                  </LineNoDiv>
                  <LineContent className={getLineClass(i)}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </LineContent>
                </Line>
              ))}
            </Pre>
          );
        }}
      </Highlight>
      <div className="editor-bottom-btns-container">
        <button onClick={onHighlightFinish}>Next</button>
      </div>
    </>
  );
};

export default Editor;
