import { Problem, LineTuple, ProblemType } from '../interface';
import {
  SequenceGenerator,
  CombinationSequencePolicy,
} from './SequenceGenerator';
/**
 * An API to generate FILL_IN_THE_BLANK PPALMS problems
 */
export class FillInTheBlankProblemGenerator {
  code: string;
  lineTuples: LineTuple[];
  maxNumToGenerate: number;
  stringLiteralMap: Map<string, string>;

  STRING_LITERAL_REPLACEMENT_TOKEN = 'STRING_LITERAL_REPLACEMENT';
  WORD_BREAKS = [
    ';',
    ',',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    ':',
    '=',
    '.',
    '+',
    '/',
    '-',
    '*',
    '?',
    "\n"
  ];

  /**
   * constructor
   * @param code - the raw source code as a string
   * @param lineTuples - the line tuples of the source code
   * @param maxNumToGenerate - the max number of problems to generate
   */
  constructor(code: string, lineTuples: LineTuple[], maxNumToGenerate: number) {
    this.lineTuples = lineTuples;
    this.maxNumToGenerate = maxNumToGenerate;
    this.stringLiteralMap = new Map();
    this.code = this.extractLiteralStrings(code);
  }

  private extractLiteralStrings(code: string) {
    let replacedStringLiteralCode = code;
    const regex = /(".*?"|'.*?'|`.*?`)/g;
    for (const match of replacedStringLiteralCode.matchAll(regex)) {
      const literalId = this.stringLiteralMap.size;
      const replacement = `${this.STRING_LITERAL_REPLACEMENT_TOKEN}_${literalId}`;
      replacedStringLiteralCode = replacedStringLiteralCode.replace(
        match[0],
        replacement
      );
      this.stringLiteralMap.set(replacement, match[0]);
    }
    return replacedStringLiteralCode;
  }

  private fillLiteralStrings(code: string) {
    let fillInCode = code;
    this.stringLiteralMap.forEach((literal, replacement) => {
      fillInCode = fillInCode.replace(replacement, literal);
    });
    return fillInCode;
  }

  private tokenize(): string[] {
    let mutatedCode = this.code;
    for (const wordBreak of this.WORD_BREAKS) {
      mutatedCode = mutatedCode.replaceAll(wordBreak, ' ');
    }

    return mutatedCode
      .split(' ')
      .map((rawToken) => rawToken.trim())
      .filter((token) => token.length > 0);
  }

  private getProblemFromTokens(tokens: string[]) {
    let blankedCode = this.code;
    let answersWithPositions = [];
    for (let token of tokens) {
      if (this.stringLiteralMap.has(token)) {
        const replacementLength = (this.stringLiteralMap.get(token) as string)
          .length;
        answersWithPositions.push({
          content: this.stringLiteralMap.get(token),
          position: blankedCode.match(token)?.index as number,
        });
        blankedCode = blankedCode.replace(token, '_'.repeat(replacementLength));
      } else {
        const regex = new RegExp(
          `(?<!${this.STRING_LITERAL_REPLACEMENT_TOKEN})${token}`
        );
        answersWithPositions.push({
          content: token,
          position: blankedCode.match(regex)?.index as number,
        });
        blankedCode = blankedCode.replace(regex, '_'.repeat(token.length));
      }
    }

    answersWithPositions.sort((a, b) => a.position - b.position);

    return {
      question: this.fillLiteralStrings(blankedCode),
      answer: answersWithPositions.map((ap) => ap.content) as string[],
    };
  }

  /**
   * Generates a list of FILL_IN_THE_BLANK problems upto maxNumToGenerate
   * @returns - the list of generated problems
   */
  generate(): Problem[] {
    const tokens = this.tokenize();
    if (tokens.length === 0) {
      return [];
    }
    let problems = [];
    const numOfBlanks = Math.floor(Math.log2(tokens.length));
    const combinationGenerator = new SequenceGenerator(
      tokens.length,
      numOfBlanks,
      CombinationSequencePolicy
    );
    for (
      let i = 0;
      i < this.maxNumToGenerate && combinationGenerator.canGenerate();
      i++
    ) {
      const combination = combinationGenerator.getRandomSequence();
      const selectedTokens = combination.map((index) => tokens[index]);
      problems.push({
        id: `fill_in_the_blank-${problems.length}`,
        type: ProblemType.FILL_IN_THE_BLANK,
        data: this.getProblemFromTokens(selectedTokens),
      });
    }
    return problems;
  }
}
