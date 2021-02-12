interface NavigationItem {
  name: string;
  path: string | URL,
}

export interface BlogConfig {
  name: string;
  pagination: {
    size: number;
  }
  navigation: NavigationItem[],
}

export interface FrontMatter {
  title: string;
  excerpt?: string;
  tags?: string[];
}

export interface PostParseResult {
  frontmatter: FrontMatter,
  content: string;
}

export interface Post extends FrontMatter {
  date: string;
  slug: string;
  content: string;
}

export interface PostResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    hasPrev: boolean;
    hasNext: boolean;
  }
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      white: string,
      whitesmoke: string,
      lightestGray: string,
      lightGray: string,
      silver: string,
      gray: string,
      darkGray: string,
      charcoal: string,
      blue: string,
    };
  }
}
