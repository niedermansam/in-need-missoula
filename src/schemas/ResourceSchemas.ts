// eslint-disable-next-line
export enum EaseOfAid {
  Easy = "Easy",
  Hard = "Hard",
  Medium = "Medium",
}

// eslint-disable-next-line
export enum Provides {
  Food = "Food",
  Housing = "Housing",
  Healthcare = "Healthcare",
  Legal = "Legal",
  Misc = "Misc",
  Academics = "Academics",
}

export interface ResourceSchema {
  priority: number;
  Contacts?: string[];
  Name: string;
  "Forms & Files"?: string[];
  Provides: Provides;
  "Administering Org"?: string[];
  Organizations?: string[];
  "Organization Names"?: string[];
  "Income Restrictions"?: boolean;
  Tags: string[];
  URL?: string;
  "Ease of Aid"?: EaseOfAid;
  resources?: string[];
  Funding: string;
  "File Names"?: string[];
  id: string;
  "Communities Served"?: string[];
  "Exclusive to Communities Served"?: boolean;
  Notes?: string;
  "Income Restrictions Details"?: string;
}

export interface ResourceLookupSchema {
  [key: string]: ResourceSchema;
}
