interface NavigationItem {
  name: string;
  path: string | URL,
}

export interface BlogConfig {
  name: string;
  navigation: NavigationItem[],
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string,
      blogName: string,
      mobileNav: string,
      headerDivider: string,
    };
  }
}
