// Styles for LinePicker component

import styled from "styled-components";

export const Wrapper = styled.div`
  font-family: sans-serif;
  text-align: center;
`;

export const Pre = styled.pre`
  text-align: left;
  margin: 0;
  padding: 1rem;
  margin: 2rem 0rem;
  min-height: calc(60vh - 1rem);
  max-height: calc(60vh - 1rem);
  overflow-y: scroll;
  border-radius: 3px;
  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`;

export const Line = styled.div`
  display: table-row;
`;

export const LineNo = styled.span`
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

export const LineNoDiv = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  cursor: pointer;
`;

export const LineContent = styled.span`
  display: table-cell;
`;

export const LineActionDiv = styled.span`
  display: table-cell;
  min-width: 2rem;
`;

export const LineAction = styled.span`
  opacity: 0.5;
  cursor: pointer;
  vertical-align: center;
  &:hover {
    opacity: 1;
  }
`;
