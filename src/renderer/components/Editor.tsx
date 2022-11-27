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

const Editor = (props: any) => {
  const [lineTuples, setLineTuples] = useState<LineTuple[]>([]);
  const [lineTupleStart, setLineTupleStart] = useState<number | null>(null);
  const [code, setCode] = useState<string>('');
  const history = useHistory();

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

  const isPartOfLineTuple = (i: number) => {
    return (
      lineTuples.filter(({ start, end }) => i >= start && i <= end).length > 0
    );
  };

  const isPreHighlightToggled = (i: number) => {
    return lineTupleStart === i;
  };

  const handleLineClick = (e: any, i: number) => {
    if (isPartOfLineTuple(i)) {
      return;
    }

    if (lineTupleStart == null) {
      setLineTupleStart(i);
    } else {
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

  const isStart = (i: number) => {
    return lineTuples.filter(({ start, end }) => i === start).length > 0;
  };

  const handleRemove = (e: any, i: number) => {
    setLineTuples((lt) => [...lt.filter(({ start, end }) => i !== start)]);
  };

  const getLineClass = (i: number) => {
    if (isPartOfLineTuple(i)) {
      return 'highlighted';
    } else if (isPreHighlightToggled(i)) {
      return 'prehighlight-selection';
    }
    return '';
  };

  const onHighlightFinish = (e: any) => {
    if (lineTuples.length == 0) {
      toast.error('Please select some lines before proceeding.');
      return;
    }

    let prevlineTuples = [...lineTuples];
    let prevLineTupleStart = lineTupleStart;

    const codeLines = code.split('\n');
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
