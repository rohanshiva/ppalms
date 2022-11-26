// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { cleanup, render, screen } from "@testing-library/react";
import Home from "../renderer/components/Home";
import useSocket from "./hooks/socket/UseSocket";
import { useHistory } from "react-router-dom";


afterEach(cleanup);

test("render home screen", () => {
  render(<Home />);
  const title = screen.getByTestId("title");
  expect(title).toHaveTextContent("PPALMS Generator")
});