---
to: src/ui/<%= name %>/<%= name %>.story.tsx
---
import * as React from 'react'
import { storiesOf } from '@storybook/react';
import {<%= h.changeCase.pascal(name) %>} from './<%= name %>';

storiesOf('ui/<%= name %>', module)
  .add('with text', () => (
    <<%= h.changeCase.pascal(name) %>>Hello <%= h.changeCase.pascal(name) %></<%= h.changeCase.pascal(name) %>>
  ));
