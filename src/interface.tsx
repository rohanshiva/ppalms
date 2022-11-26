export interface LineTuple {
    start: number,
    end: number
}

export enum ProblemType {
    REORDER,
    MULTIPLE_CHOICE
}

export interface Problem{
    id: string,
    type: ProblemType,
    data: ReorderProblemData
}

export interface ReorderProblemData{
    question: string[],
    answer:string
}


export interface ProblemSet{
    name: string,
    problems: Problem[],
    generatedAt: string,
    problemTypes: ProblemType[]
}

  
