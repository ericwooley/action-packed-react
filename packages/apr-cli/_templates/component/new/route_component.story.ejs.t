---
to: <%=route%>/components/<%= name %>/<%= name %>.story.tsx
---
import * as React from 'react'
import { storiesOf } from '@storybook/react';
import {<%= h.changeCase.pascal(name) %>} from './<%= name %>';

storiesOf('app/<%= route.replace(/^\/?src\/?/g, '').replace(/routes\//g, '') %>/_components/<%= name %>', module)
  .add('with text', () => (
    <<%= h.changeCase.pascal(name) %>>Hello <%= h.changeCase.pascal(name) %></<%= h.changeCase.pascal(name) %>>
  ));
