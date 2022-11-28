import { Problem, ProblemType, LineTuple } from '../interface';

/**
 * An internal class to PermutationGenerator to store data regarding permutation generator
 */
class PermutationGeneratorNode {
  index: number;
  possibleIndicies: number[];
  permutationSequences: Map<number, PermutationGeneratorNode>;
  cannotGenerateFurther: boolean;

  /**
   * Constructor
   * @param index - The index of the item which has been selected in the permutation sequence
   * @param unselectedIndicies - The index of the items which have not been selected so far in the permutation sequence
   */
  constructor(index: number, unselectedIndicies: number[]) {
    this.index = index;
    this.possibleIndicies = unselectedIndicies.filter((i) => i !== index);
    this.permutationSequences = new Map();
    this.cannotGenerateFurther = false;
  }
}

/**
 * An internal class to ReorderProblemGenerator which is used to randomly generate unique permutations of numbers.
 */
export class PermutationGenerator {
  size: number;
  root: PermutationGeneratorNode;

  /**
   * constructor
   * @param size - the number of items. If size is 5, then there are 5 items: [0, 1, 2, 3, 4]
   */
  constructor(size: number) {
    if (size < 0) {
      throw new Error("'size' cannot be negative");
    }

    this.size = size;

    let initialUnselectedIndicies = [];
    for (let i = 0; i < this.size; i++) {
      initialUnselectedIndicies.push(i);
    }
    this.root = new PermutationGeneratorNode(-1, initialUnselectedIndicies);
  }

  /**
   * @returns true if anymore unique permutations can be generated, false otherwise
   */
  canGenerate() {
    return !this.root.cannotGenerateFurther;
  }

  /**
   * Precondition is that more unique permutations can be generated
   * @returns a list of numbers which represents the permutation
   */
  getRandomPermutation(): number[] {
    let permutation: number[] = [];

    const makeRandomChoice = (arr: any[]) => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    };

    const recursivelyGeneratePermutation = (node: PermutationGeneratorNode) => {
      if (node.possibleIndicies.length === 0) {
        node.cannotGenerateFurther = true;
        return;
      }
      const possibleChoices = node.possibleIndicies.filter((index) => {
        return !(
          node.permutationSequences.has(index) &&
          node.permutationSequences.get(index)?.cannotGenerateFurther
        );
      });
      const choice = makeRandomChoice(possibleChoices);
      if (!node.permutationSequences.has(choice)) {
        node.permutationSequences.set(
          choice,
          new PermutationGeneratorNode(choice, node.possibleIndicies)
        );
      }

      permutation.push(choice);
      recursivelyGeneratePermutation(
        node.permutationSequences.get(choice) as PermutationGeneratorNode
      );
      let cannotGenerateFurther = true;
      if (node.possibleIndicies.length === node.permutationSequences.size) {
        node.permutationSequences.forEach((sequenceNode, _) => {
          cannotGenerateFurther &&= sequenceNode.cannotGenerateFurther;
        });
      } else {
        cannotGenerateFurther = false;
      }

      node.cannotGenerateFurther = cannotGenerateFurther;
    };

    recursivelyGeneratePermutation(this.root);
    return permutation;
  }
}

/**
 * An API to generate REORDER PPALMS problems
 */
export class ReorderProblemGenerator {
  /**
   * Generates a list of REORDER problems from some source code and a max number of problems to generate
   * @param code - the source code as a string
   * @param maxNumToGenerate - the max number of problems to generate
   * @returns - the list of generated problems
   */
  static generate(code: string, lineTuples: LineTuple[], maxNumToGenerate: number): Problem[] {
    let problems = [];
    const lines = code.split('\n');
    const generator = new PermutationGenerator(lines.length);
    // generates random unique permutations of the source code lines uptil maxNumToGenerate or no
    // more problems can be generated. These random unique permutations are used to create the REORDER problem
    for (let i = 0; i < maxNumToGenerate && generator.canGenerate(); i++) {
      const permutation = generator.getRandomPermutation();
      const shuffledLines = permutation.map((i) => lines[i]);

      problems.push({
        id: `reorder-${i}`,
        type: ProblemType.REORDER,
        data: {
          question: shuffledLines,
          answer: {
            code: code,
            lineTuples: lineTuples
          }
        },
      });
    }

    return problems;
  }
}
