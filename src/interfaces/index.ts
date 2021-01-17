export interface BlogConfig {
  name: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string,
      blogName: string,
    };
  }
}
