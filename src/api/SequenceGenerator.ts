import { spread } from 'Util';

type SequencePolicy = (
  items: number,
  size: number,
  pickedChoices: number[]
) => number[];

export const PermutationSequencePolicy: SequencePolicy = (
  itemCount: number,
  size: number,
  pickedChoices: number[]
) => {
  return spread(0, itemCount - 1).filter(
    (item) => !pickedChoices.includes(item)
  );
};

export const CombinationSequencePolicy: SequencePolicy = (
  itemCount: number,
  size: number,
  pickedChoices: number[]
) => {
  let largestChoice = -1;
  if (pickedChoices.length > 0) {
    largestChoice = Math.max(...pickedChoices);
  }

  const maxChoiceThatCanBeMade = itemCount - (size - pickedChoices.length);
  return spread(largestChoice + 1, maxChoiceThatCanBeMade);
};

/**
 * An internal class to SequenceGenerator to store data regarding sequence generator
 */
class SequenceGeneratorNode {
  index: number;
  possibleIndicies: number[];
  sequences: Map<number, SequenceGeneratorNode>;
  cannotGenerateFurther: boolean;

  /**
   * Constructor
   * @param index - The index of the item which has been selected in the sequence
   * @param possibleIndicies - The index of the items which have can be selected in the sequence
   */
  constructor(index: number, possibleIndicies: number[]) {
    this.index = index;
    this.possibleIndicies = possibleIndicies;
    this.sequences = new Map();
    this.cannotGenerateFurther = false;
  }
}

/**
 * A class used to randomly generate unique sequences of numbers.
 */
export class SequenceGenerator {
  itemCount: number;
  size: number;
  sequencePolicy: SequencePolicy;
  root: SequenceGeneratorNode;

  /**
   * constructor
   * @param itemCount - the number of items
   * @param size - the size of the sequence to generate
   */
  constructor(itemCount: number, size: number, sequencePolicy: SequencePolicy) {
    if (itemCount < 0) {
      throw new Error("'itemCount' cannot be negative");
    }

    if (size > itemCount) {
      throw new Error("'size' cannot be larger than 'itemCount'");
    }

    this.itemCount = itemCount;
    this.size = size;
    this.sequencePolicy = sequencePolicy;
    this.root = new SequenceGeneratorNode(
      -1,
      sequencePolicy(this.itemCount, this.size, [])
    );
  }

  /**
   * @returns true if anymore unique sequences can be generated, false otherwise
   */
  canGenerate() {
    return !this.root.cannotGenerateFurther;
  }

  /**
   * Precondition is that more unique sequences that can be generated
   * @returns a list of numbers which represents the sequence
   */
  getRandomSequence(): number[] {
    let sequence: number[] = [];

    const makeRandomChoice = (arr: any[]) => {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    };

    const recursivelyGenerateSequence = (node: SequenceGeneratorNode) => {
      if (node.possibleIndicies.length === 0 || sequence.length == this.size) {
        node.cannotGenerateFurther = true;
        return;
      }
      const possibleChoices = node.possibleIndicies.filter((index) => {
        return !(
          node.sequences.has(index) &&
          node.sequences.get(index)?.cannotGenerateFurther
        );
      });
      const choice = makeRandomChoice(possibleChoices);
      sequence.push(choice);

      if (!node.sequences.has(choice)) {
        node.sequences.set(
          choice,
          new SequenceGeneratorNode(
            choice,
            this.sequencePolicy(this.itemCount, this.size, sequence)
          )
        );
      }

      recursivelyGenerateSequence(
        node.sequences.get(choice) as SequenceGeneratorNode
      );
      let cannotGenerateFurther = true;
      if (node.possibleIndicies.length === node.sequences.size) {
        node.sequences.forEach((sequenceNode, _) => {
          cannotGenerateFurther &&= sequenceNode.cannotGenerateFurther;
        });
      } else {
        cannotGenerateFurther = false;
      }

      node.cannotGenerateFurther = cannotGenerateFurther;
    };

    recursivelyGenerateSequence(this.root);
    return sequence;
  }
}
