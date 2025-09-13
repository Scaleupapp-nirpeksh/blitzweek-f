import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
    background: radial-gradient(1200px 600px at 10% 10%, rgba(245,188,0,0.12), transparent 50%),
                radial-gradient(1200px 600px at 90% 20%, rgba(245,188,0,0.1), transparent 50%),
                #0c2b39;
    color: #eaf4f7;
  }
  a { color: inherit; text-decoration: none; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
`
