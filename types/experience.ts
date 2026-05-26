export interface FAQ {
  question: string;
  answer: string;
}

export interface Experience {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  startingPrice: number;
  duration: string;
  image: string;
  suitableFor: string[];
  includes: string[];
  sampleFlow: string[];
  recommendedYachts: string[];
  faq: FAQ[];
  seo: {
    title: string;
    description: string;
  };
}
