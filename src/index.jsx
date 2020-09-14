import 'core-js/stable' // Import before everything to use throughout the app
import 'regenerator-runtime/runtime' // Needed to use the transpiled generator fns from core-js
import React from 'react'
import { render } from 'react-dom'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import lightBlue from '@material-ui/core/colors/lightBlue'
import red from '@material-ui/core/colors/red'

import ErrorBoundary from 'components/ErrorBoundary'
import App from 'components/App'

import './styles/index.css'

// Selected based on colors provided at
// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=00E676&secondary.color=00B0FF
const theme = createMuiTheme({
  // Move to the new material-ui typography
  // https://material-ui.com/style/typography/#migration-to-typography-v2
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { main: '#15d8b1' },
    secondary: { main: lightBlue.A400 },
    error: { main: red.A400 },
  },
  overrides: {
    MuiFormControlLabel: {
      root: {
        marginLeft: '0px',
        marginRight: '0px',
      },
    },
    MuiButton: {
      root: {
        textTransform: 'none',
        fontSize: '1rem',
      },
    },
  },
})

render(
  <ErrorBoundary>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
)
