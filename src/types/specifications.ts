export interface SpecificationSection {
  title: string;
  content: string;
  order: number;
}

export interface SpecificationDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  sections: SpecificationSection[];
  createdAt: string;
  updatedAt: string;
}

export interface SpecificationCategory {
  id: string;
  name: string;
  description: string;
  documents: SpecificationDocument[];
}
