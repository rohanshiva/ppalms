import { LineTuple, ProblemType, Problem, ProblemSet } from '../interface';
import { ReorderProblemGenerator } from '../api/ReorderProblemGenerator';

/**
 * An API to generate PPALMS problems for a given piece of source code plus some generation config
 */
export class ProblemSetGenerator {
  /**
   * Given the types of problems to generate, source code, line tuples (lines which can be reordered amongst each other with no effect)
   * to the program, the max number of problems to generate and the problem set name, generates a new problem set. At the moment, only
   * REORDER problems are generated.
   * @param problemTypes
   * @param code
   * @param lineTuples
   * @param maxNumberOfProblems
   * @param name
   * @returns the newly generated problem set
   */
  static generate(
    problemTypes: ProblemType[],
    code: string,
    lineTuples: LineTuple[],
    maxNumberOfProblems: number,
    name: string
  ): ProblemSet {

    let generatedProblems: Problem[] = [];
    // todo(pitch034): implement the generation of other problem types in addition to reorder
    if (problemTypes.includes(ProblemType.REORDER)) {
      generatedProblems = generatedProblems.concat(
        ReorderProblemGenerator.generate(code, maxNumberOfProblems)
      );
    }
    return {
      name: name,
      generatedAt: new Date(Date.now()).toISOString(),
      problemTypes: problemTypes,
      problems: generatedProblems,
    };
  }
}
