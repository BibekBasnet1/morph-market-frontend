export interface Tag {
  id: number;
  name: string;
  slug: string;
};

export interface Diet {
  id: number;
  name: string;
  slug: string;
};

export interface Trait {
  id: number;
  name: string;
  category_id: number;
  description?: string;
};

export interface Maturity {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export interface Origin {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export interface Gender {
  id: number;
  name: string;
  slug: string;
  description?: string;
};


