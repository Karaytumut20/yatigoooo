export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  seo: {
    title: string;
    description: string;
  };
}
