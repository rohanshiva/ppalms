import { ReorderProblemGenerator } from 'api/ReorderProblemGenerator';
import { ProblemType } from 'interface';

describe('ReorderProblemGenerator', () => {
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

  const smallCodeSample = `
  let x = 1;
  let y = 1;
  `.trim();

  const doLinesMatchInSomeArrangement = (
    lines1: string[],
    lines2: string[]
  ) => {
    const lineCompare = (line1: string, line2: string) => {
      if (line1 < line2) {
        return -1;
      }
      return 1;
    };
    lines1.sort(lineCompare);
    lines2.sort(lineCompare);

    if (lines1.length === lines2.length) {
      for (let i = 0; i < lines1.length; i++) {
        if (lines1[i] !== lines2[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  test('generates a single reorder problem', () => {
    const problems = ReorderProblemGenerator.generate(
      reactSourceCode,
      [{ start: 0, end: 5 }],
      1
    );
    expect(problems.length).toBe(1);
    const problem = problems[0];
    expect(problem.type).toBe(ProblemType.REORDER);

    //@ts-ignore
    expect(problem.data.answer.code).toBe(reactSourceCode);
    //@ts-ignore
    expect(problem.data.answer.lineTuples).toStrictEqual([
      { start: 0, end: 5 },
    ]);

    expect(
      doLinesMatchInSomeArrangement(
        //@ts-ignore
        problem.data.question,
        reactSourceCode.split('\n')
      )
    ).toBe(true);
  });

  test('unique reordering problems are generated', () => {
    const problems = ReorderProblemGenerator.generate(
      reactSourceCode,
      [
        { start: 0, end: 2 },
        { start: 4, end: 6 },
      ],
      10
    );
    expect(problems.length).toBe(10);
    const reorderingProblems = new Set();
    for (const problem of problems) {
      expect(problem.type).toBe(ProblemType.REORDER);
      //@ts-ignore
      expect(problem.data.answer.code).toBe(reactSourceCode);
      //@ts-ignore
      expect(problem.data.answer.lineTuples).toStrictEqual([
        { start: 0, end: 2 },
        { start: 4, end: 6 },
      ]);
      //@ts-ignore
      reorderingProblems.add(problem.data.question.join('\n'));
      expect(
        doLinesMatchInSomeArrangement(
          //@ts-ignore
          problem.data.question,
          reactSourceCode.split('\n')
        )
      ).toBe(true);
    }
    expect(reorderingProblems.size).toBe(10);
  });

  test('more problems are requested to be generated than possible', () => {
    const problems = ReorderProblemGenerator.generate(
      smallCodeSample,
      [{ start: 0, end: 1 }],
      10
    );
    expect(problems.length).toBe(2);
  });
});
