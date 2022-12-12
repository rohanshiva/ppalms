import { Problem, ProblemType, LineTuple } from '../interface';
import {
  SequenceGenerator,
  PermutationSequencePolicy,
} from './SequenceGenerator';
/**
 * An API to generate REORDER PPALMS problems
 */
export class ReorderProblemGenerator {
  code: string
  lineTuples: LineTuple[]
  maxNumToGenerate: number
  /**
   * constructor
   * @param code - the raw source code as a string
   * @param lineTuples - the line tuples of the source code
   * @param maxNumToGenerate - the max number of problems to generate
   */
  constructor(code: string, lineTuples: LineTuple[], maxNumToGenerate: number) {
    this.code = code;
    this.lineTuples = lineTuples;
    this.maxNumToGenerate = maxNumToGenerate;
  }

   /**
   * Generates a list of REORDER problems from some source code and a max number of problems to generate
   * @returns - the list of generated problems
   */
  generate(): Problem[] {
    let problems = [];
    const lines = this.code.split('\n');
    const generator = new SequenceGenerator(
      lines.length,
      lines.length,
      PermutationSequencePolicy
    );
    // generates random unique permutations of the source code lines uptil maxNumToGenerate or no
    // more problems can be generated. These random unique permutations are used to create the REORDER problem
    for (let i = 0; i < this.maxNumToGenerate && generator.canGenerate(); i++) {
      const permutation = generator.getRandomSequence();
      const shuffledLines = permutation.map((i) => lines[i]);

      problems.push({
        id: `reorder-${i}`,
        type: ProblemType.REORDER,
        data: {
          question: shuffledLines,
          answer: {
            code: this.code,
            lineTuples: this.lineTuples,
          },
        },
      });
    }

    return problems;
  }
}
