import React from 'react';
import { addReadme } from 'storybook-readme';
import { create } from '@storybook/theming';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { ThemeProvider } from 'react-jss';

import theme from '../src/style/globalStyle';
import '../src/style/base.css';

const basicTheme = create({
  base: 'light',
  brandTitle: 'your-library-name',
  brandUrl: 'https://github.com/your-library-name',
  brandImage: null,
});

addParameters({
  options: {
    showPanel: true,
    panelPosition: 'right',
    theme: basicTheme,
  },
  readme: {
    codeTheme: 'github',

    StoryPreview: ({ children }) => (
      <div style={{ padding: 16 }}>{children}</div>
    ),

    /**
     * Wrapper for header docs. Usually used to set some styles
     * NOTE: will be applied only for content docs (docs around the story)
     */
    HeaderPreview: ({ children }) => <div>{children}</div>,

    /**
     * Wrapper for footer docs. Usually used to set some styles
     * NOTE: will be applied only for content docs (docs around the story)
     */
    FooterPreview: ({ children }) => <div>{children}</div>,

    /**
     * Wrapper for content and sidebar docs. Usually used to set some styles
     * NOTE: will be applied only for content docs (docs around the story)
     */
    DocPreview: ({ children }) => <div style={{ padding: 16 }}>{children}</div>,
  },
});

addDecorator(addReadme);

addDecorator((story) => <ThemeProvider theme={theme}>{story()}</ThemeProvider>);

const loaderFn = () => {
  // put welcome screen at the top of the list so it's the first one displayed
  const allExports = [require('./welcome.stories.tsx')];

  // automatically import all story ts files that end with *.stories.tsx
  const req = require.context('../src/components', true, /\.stories\.tsx$/);
  req.keys().forEach((fname) => allExports.push(req(fname)));
  return allExports;
};

configure(loaderFn, module);
