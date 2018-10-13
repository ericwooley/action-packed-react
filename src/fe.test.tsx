import * as React from 'react'
import { defineApp } from './fe'
import { createMemoryHistory } from 'history'
import { mount, render } from 'enzyme'
import { Provider } from 'react-redux'
class ProductsComponent extends React.Component<{
  productsLen: number
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
  let app = defineApp({
    initialState: {
      str: '',
      num: 15
    },
    initialReducers: {
      str: () => 'test',
      num: () => 12
    },
    history: createMemoryHistory(),
    render: jsx => mount(jsx)
  })
  beforeEach(async () => {
    await app.init()
  })
  it('should be setup', () => {
    expect(app).toBeTruthy()
  })
  describe('child route', () => {
    const createProducts = () =>
      app.createSubRoute('products', async () => ({
        component: ProductsComponent,
        // saga: function* ProductsSaga(): any {},
        reducer: {
          products: (state: Array<{ type: string }> = [], action: { type: string }) => [
            ...state,
            action
          ]
        }
      }))
    describe('without route matching', () => {
      let products: ReturnType<typeof createProducts>
      beforeEach(() => {
        products = createProducts()
      })
      it('should create Products', () => {
        expect(products).toBeTruthy()
        expect(products.connect).toBeTruthy()
        expect(products.createSubRoute).toBeTruthy()
        expect(products.getState).toBeTruthy()
      })

      it('should connect Products', () => {
        const ConnectedProducts = products.connect(
          state => ({
            productsLen: state.products.length
          }),
          {
            onClick: () => console.log('click')
          }
        )(ProductsComponent)
        expect(() =>
          render(
            <Provider store={app.store}>
              <ConnectedProducts test="" />
            </Provider>
          )
        ).toThrowErrorMatchingInlineSnapshot(`"Cannot read property 'length' of undefined"`)
      })
      it('should create a sub route', () => {
        // should not error
        const productSearch = products.createSubRoute('search/:terms', async () => ({
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
        }))
        const ConnectedProductSearch = productSearch.connect(state => ({
          title: state.productSearch.test
        }))(ProductSearchComponent)
        expect(() =>
          render(
            <Provider store={app.store}>
              <ConnectedProductSearch />
            </Provider>
          )
        ).toThrowErrorMatchingInlineSnapshot(`"Cannot read property 'test' of undefined"`)
      })
    })
  })
})
