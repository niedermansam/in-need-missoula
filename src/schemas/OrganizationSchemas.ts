export interface OrganizationSchema {
    Tags?: string[];
    URL?: string;
    Category?: string;
    'Resources Available'?: string[];
    Expertise: string;
    Name: string;
    'Administer of'?: string[];
    'Resource Names'?: string[];
    id: string;
    Contacts?: string[];
    Notes?: string;
    Phone?: string;
    Email?: string;
    'Affiliated Organizations'?: string[];
}

export interface OrganizationLookupSchema {
  [key:string]:OrganizationSchema
}
