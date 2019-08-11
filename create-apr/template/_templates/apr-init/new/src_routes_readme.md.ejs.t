---
to: src/routes/readme.md
---

# Routes
`routes` is a folder for holding other routes, which follows the
[fractal pattern](https://hackernoon.com/fractal-a-react-app-structure-for-infinite-scale-4dab943092af).

Each route contains:
  * a `routes` folder for sub routes.
  * a `components` folder for react components for this route.
  * a `redux` folder, for
    [ducks](https://github.com/erikras/ducks-modular-redux),
    [sagas](https://redux-saga.js.org/), and anything else related to redux.
