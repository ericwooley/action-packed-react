---
to: src/redux/selectors/index.ts
---
import { createSelector } from 'reselect'
import {app} from '../..'

const confirmedWelcome = createSelector(app.baseSelector, (s) => s.ui.welcomeConfirmed)
