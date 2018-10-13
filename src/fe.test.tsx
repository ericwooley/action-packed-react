import * as React from 'react'
import { init } from './fe'
import { JSDOM } from 'jsdom'
import { createMemoryHistory } from 'history'
import { render } from 'react-dom'
const dom = new JSDOM(
  `<!DOCTYPE html>
    <html>
      <body>
        <div id="root">
          JS not supported
        </div>
      </body>
    </html>`
)
class ProductsComponent extends React.Component<{
  products: { type: string }[]
  test: string
  onClick: () => any
}> {
  render() {
    return <h1>ProductsComponent</h1>
  }
}
class ProductSearchComponent extends React.Component<{
  title: string
}> {
  render() {
    return <h1>ProductSearchComponent</h1>
  }
}
describe('the wooley way fe', () => {
  it('should look like this', () => {
    const rootEl = dom.window.document.getElementById('root')
    if (!rootEl) throw new Error('Could not create root')
    const app = init({
      initialState: {
        str: '',
        num: 15
      },
      initialReducers: {
        str: () => 'test',
        num: () => 12
      },
      history: createMemoryHistory(),
      rootEl
    })

    const products = app.createSubRoute('products', async () => ({
      component: ProductsComponent,
      // saga: function* ProductsSaga(): any {},
      reducer: {
        products: (
          state: Array<{ type: string }> = [],
          action: { type: string }
        ) => [...state, action]
      }
    }))

    const ConnectedProducts = products.connect(
      state => ({
        products: state.products
      }),
      {
        onClick: () => console.log('click')
      }
    )(ProductsComponent)
    // should not error
    render(<ConnectedProducts test="" />, rootEl)
    const productSearch = products.createSubRoute(
      'search/:terms',
      async () => ({
        component: ProductSearchComponent,
        // saga: function* ProductsSearchSaga(): any {},
        reducer: {
          producer: () => null,
          productSearch: (
            state: { test: string },
            action: { type: string; payload: string }
          ) => ({
            ...state,
            test: action.payload
          })
        }
      })
    )
    const ConnectedProductSearch = productSearch.connect(state => ({
      title: state.productSearch.test
    }))(ProductSearchComponent)
    render(<ConnectedProductSearch />, rootEl)
  })
})
