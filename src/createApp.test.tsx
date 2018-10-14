import * as React from 'react'
import { createApp } from './createApp'
import { createMemoryHistory } from 'history'
import { mount, render } from 'enzyme'
import { Provider } from 'react-redux'
class ProductsComponent extends React.Component<{
  productsLen: number
  test: string
  onClick: () => any
}> {
  render() {
    return (
      <div>
        <h1>ProductsComponent {this.props.productsLen}</h1>
        <p>{this.props.test}</p>
      </div>
    )
  }
}
class ProductSearchComponent extends React.Component<{
  title: string
}> {
  render() {
    return <h1>ProductSearchComponent</h1>
  }
}
const createBasicApp = () => {
  const history = createMemoryHistory()
  return {
    history,
    app: createApp({
      history: history,
      initialState: {
        str: '',
        num: 15
      },
      initialReducers: {
        str: () => 'test',
        num: () => 12
      },
      render: jsx => {
        mount(jsx)
        return () => null
      }
    })
  }
}
const createProducts = () => {
  const { app, history } = createBasicApp()
  const products = app.createSubRoute('products', async () => ({
    component: ProductsComponent,
    // saga: function* ProductsSaga(): any {},
    reducer: {
      products: (state: Array<{ type: string }> = [], action: { type: string }) => [
        ...state,
        action
      ]
    }
  }))
  return {
    app,
    history,
    products
  }
}
const createProductsSearch = () => {
  const { products, app, history } = createProducts()
  const productSearch = products.createSubRoute('search/:terms', async () => ({
    component: ProductSearchComponent,
    // saga: function* ProductsSearchSaga(): any {},
    reducer: {
      producer: () => null,
      productSearch: (state: { test: string }, action: { type: string; payload: string }) => ({
        ...state,
        test: action.payload
      })
    }
  }))
  return { productSearch, products, app, history }
}
describe('the wooley way fe', () => {
  beforeEach(async () => {})
  it('should be setup', async () => {
    let { app } = createBasicApp()
    await app.init()
    expect(app).toBeTruthy()
  })
  describe('child route', () => {
    describe('with matching route', () => {
      it('should mount on navigate', done => {
        const { app, history } = createBasicApp()
        const productRoute = app.createSubRoute(
          'products',
          async () => ({
            component: ProductsComponent,
            // saga: function* ProductsSaga(): any {},
            reducer: {
              products: (state: Array<{ type: string }> = [], action: { type: string }) => [
                ...state,
                action
              ]
            }
          }),
          {
            onMount: () => {
              expect(
                render(
                  <Provider store={app.store}>
                    <ConnectedProducts test="" />
                  </Provider>
                ).html()
              ).toMatchSnapshot()
              done()
            }
          }
        )
        const ConnectedProducts = productRoute.connect(
          state => ({
            productsLen: state.products.length
          }),
          {
            onClick: () => console.log('click')
          }
        )(ProductsComponent)
        app.init()
        history.push('/products')
      })
    })
    describe('without route matching', () => {
      let productsApp: ReturnType<typeof createProducts>
      let productSearchApp: ReturnType<typeof createProductsSearch>
      beforeEach(() => {
        productsApp = createProducts()
        productSearchApp = createProductsSearch()
      })
      it('should create Products', () => {
        expect(productsApp).toBeTruthy()
        expect(productsApp.products.connect).toBeTruthy()
        expect(productsApp.products.createSubRoute).toBeTruthy()
        expect(productsApp.products.getState).toBeTruthy()
      })

      it('should connect Products', () => {
        const ConnectedProducts = productsApp.products.connect(
          state => ({
            productsLen: state.products.length
          }),
          {
            onClick: () => console.log('click')
          }
        )(ProductsComponent)
        expect(() =>
          render(
            <Provider store={productsApp.app.store}>
              <ConnectedProducts test="" />
            </Provider>
          )
        ).toThrowErrorMatchingInlineSnapshot(`"Cannot read property 'length' of undefined"`)
      })
      it('should create a sub route', () => {
        // should not error
        const ConnectedProductSearch = productSearchApp.productSearch.connect(state => ({
          title: state.productSearch.test
        }))(ProductSearchComponent)
        expect(() =>
          render(
            <Provider store={productSearchApp.app.store}>
              <ConnectedProductSearch />
            </Provider>
          )
        ).toThrowErrorMatchingInlineSnapshot(`"Cannot read property 'test' of undefined"`)
      })
    })
  })
})
