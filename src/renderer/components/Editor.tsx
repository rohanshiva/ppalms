import { useState } from 'react';
import {
  Pre,
  Line,
  LineNo,
  LineNoDiv,
  LineContent,
  LineAction,
  LineActionDiv,
} from './EditorStyle';
import './Editor.css';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github';
import { Link } from 'react-router-dom';

export interface LineTuple {
  start: number;
  end: number;
}

const Editor = (props: any) => {
  const [lineTuples, setLineTuples] = useState<LineTuple[]>([]);
  const [lineTupleStart, setLineTupleStart] = useState<number | null>(null);
  const handleLineClick = (e: any, i: number) => {
    for (const { start, end } of lineTuples) {
      if (i >= start && i <= end) {
        return;
      }
    }

    if (!lineTupleStart) {
      setLineTupleStart(i);
    } else {
      if (e.shiftKey) {
        setLineTuples((lt) => [...lt, { start: lineTupleStart, end: i }]);
        setLineTupleStart(null);
      } else {
        setLineTupleStart(i);
      }
    }
  };

  const isHighlighted = (i: number) => {
    return (
      lineTuples.filter(({ start, end }) => i >= start && i <= end).length >
        0 || lineTupleStart === i
    );
  };

  const isStart = (i: number) => {
    return (
      lineTupleStart === i ||
      lineTuples.filter(({ start, end }) => i === start).length > 0
    );
  };
  const handleRemove = (e: any, i: number) => {
    setLineTuples((lt) => [...lt.filter(({ start, end }) => i !== start)]);
  };

  return (
    <>
      <Link to="/">
        <button>🏠</button>
      </Link>
      <h3>
        Please select lines to generate problems. 
      </h3>
      <div>
        Use <kbd>(shift+select)</kbd> to select line tuples.
      </div>
      <Highlight
        {...defaultProps}
        theme={theme}
        code={props.location.state.code}
        language="jsx"
      >
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
                  <LineContent
                    className={isHighlighted(i) ? 'highlighted' : ''}
                  >
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
        <Link to="/">
          <button>Next</button>
        </Link>
      </div>
    </>
  );
};

export default Editor;
