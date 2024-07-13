export enum LabelType {
    FUNNY = "FUNNY",
    BUGGY = "BUGGY",
    PROFESSIONAL = "PROFESSIONAL",
    VALUED = "VALUED",
}

export interface LabelWithVote {
    label: LabelType
    vote: number
}

export interface ThreadContent {
    query: string;
    response: string;
    image: string;
    labelsWithVote: Array<LabelWithVote>;
}
