// eslint-disable-next-line
export enum TagStatus {
    favorite = 'fav',
    filtered = 'filter',
    lessInterested = 'down',
    none = 'none'
  }

// eslint-disable-next-line
export enum TagPriority {
  favorite = 1,
  none = 0,
  lessInterested = -1,
  filtered = -2,
}

export interface TagLookupInterface {
    categories: string[];
    status: string;
    priority: number;
  }

export type TagArray = string[];
