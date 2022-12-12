import { LineTuple, ProblemType, Problem, ProblemSet} from '../interface';
import { ReorderProblemGenerator } from '../api/ReorderProblemGenerator';
import { FillInTheBlankProblemGenerator } from './FillInTheBlankProblemGenerator';

/**
 * An API to generate PPALMS problems for a given piece of source code plus some generation config
 */
export class ProblemSetGenerator {
  /**
   * Given the types of problems to generate, source code, line tuples (lines which can be reordered amongst each other with no effect)
   * to the program, the problem type config to generate and the problem set name, generates a new problem set. At the moment, only
   * REORDER problems are generated.
   * @param problemTypes - a list of the problem types to generate
   * @param code - a string of the source code 
   * @param lineTuples - a list of line tuples
   * @param problemTypeConfig - the maximum # of problems to generate per type
   * @param name - the name of the generated problem set
   * @returns the newly generated problem set
   */
  static generate(
    problemTypes: ProblemType[],
    code: string,
    lineTuples: LineTuple[],
    numOfProbsPerType: {[key in ProblemType]: number} ,
    name: string
  ): ProblemSet {

    if(name.trim().length === 0){
      throw new Error("'name' cannot be an empty or a blank string");
    }

    let generatedProblems: Problem[] = [];
    if (ProblemType.REORDER in numOfProbsPerType) {
      const generator = new ReorderProblemGenerator(code, lineTuples, numOfProbsPerType[ProblemType.REORDER])
      generatedProblems = generatedProblems.concat(
        generator.generate()
      );
    }

    if(ProblemType.FILL_IN_THE_BLANK in numOfProbsPerType){
      const generator = new FillInTheBlankProblemGenerator(code, lineTuples, numOfProbsPerType[ProblemType.FILL_IN_THE_BLANK]);
      generatedProblems = generatedProblems.concat(
        generator.generate()
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
