import { LineTuple, ProblemType, Problem, ProblemSet } from '../interface';

export class ProblemSetGenerator {
  static generate(
    problemTypes: ProblemType[],
    code: string,
    lineTuples: LineTuple[],
    maxNumberOfProblems: number,
    name: string
  ): ProblemSet {
    const shuffle = (rawLines: string[]) => {
      const swap = (i: number, j: number) => {
        const temp = rawLines[i];
        rawLines[i] = rawLines[j];
        rawLines[j] = temp;
      }

      for(let i = rawLines.length - 1; i >= 0; i--){
        let randomIndex = Math.floor((Math.random() * (i + 1)))
        swap(randomIndex, i);
      }

      return rawLines;
    }

    let generatedProblems: Problem[] = [];
    // todo(pitch034): implement the generation of other problems in addition to reorder
    if(problemTypes.includes(ProblemType.REORDER)){
      let generatedShuffles: Set<string> = new Set();
      for(let i = 0; i < maxNumberOfProblems; i++){
        let hasGeneratedUniqueProblem = false;
        while(!hasGeneratedUniqueProblem){
          let shuffledLines = shuffle(code.split("\n"));
          let shuffledCode = shuffledLines.join("\n");
          if(!generatedShuffles.has(shuffledCode)){
            hasGeneratedUniqueProblem = true;
            generatedShuffles.add(shuffledCode);

            generatedProblems.push({
              id: `reorder-${i}`,
              type: ProblemType.REORDER,
              data: {
                question: shuffledLines,
                answer: code
              }
            })
          }
        }        
      }
    } 

    return {
      name: name,
      generatedAt: new Date(Date.now()).toISOString(),
      problemTypes: problemTypes,
      problems: generatedProblems
    }
  }
}
