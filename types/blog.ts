export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  showImage?: boolean;
  seo?: {
    title: string;
    description: string;
    display_options?: {
      show_image?: boolean;
    };
  };
}
