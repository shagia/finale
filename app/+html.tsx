import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <ScrollViewStyleReset />

        {/* Font-face declaration for Safari compatibility */}
        <style dangerouslySetInnerHTML={{ __html: fontFaceStyles }} />
        
        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}


const fontFaceStyles = `
@font-face {
  font-family: 'IBM Plex Mono';
  src: url('/fonts/ibm-plex-mono/IBMPlexMono-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
`;

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;

