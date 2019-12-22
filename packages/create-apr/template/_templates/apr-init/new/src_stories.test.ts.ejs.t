---
to: src/stories.test.ts
---
import initStoryshots, {
  multiSnapshotWithOptions
} from '@storybook/addon-storyshots'

initStoryshots({
  integrityOptions: { cwd: __dirname },
  test: multiSnapshotWithOptions({})
})