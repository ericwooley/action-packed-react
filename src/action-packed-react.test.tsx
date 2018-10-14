import * as React from 'react'
import { createApp, BareBonesState } from './action-packed-react'
import { createMemoryHistory } from 'history'
import { mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import { createActionPack, createReducerFromActionPack } from './createReducer'
const sanitizeState = (state: BareBonesState) => ({
  ...state,
  _route: {
    ...state._route,
    history: state._route.history.map((item, idx) => ({
      ...item,
      key: `${idx}`
    })),
    key: '<key>'
  }
})
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
        {this.props.children}
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

interface Product {
  type: string
}
interface ProductState {
  products: Product[]
}
const productsState: ProductState = {
  products: [{ type: 'test' }]
}
const addProduct = createActionPack<ProductState, { type: string }>(
  'ADD_PRODUCT',
  (state: ProductState, action) => ({
    ...productsState,
    products: [...state.products, action.payload]
  })
)

const productReducer = createReducerFromActionPack(productsState, [addProduct])
const createProducts = () => {
  const { app, history } = createBasicApp()
  const products = app.createSubRoute('products', async () => ({
    component: ProductsComponent,
    // saga: function* ProductsSaga(): any {},
    reducer: { products: productReducer }
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
      productSearch: (
        state: { test: string },
        action: { type: string; payload: string }
      ) => ({
        ...state,
        test: action.payload
      })
    }
  }))
  return { productSearch, products, app, history }
}
describe('the wooley way fe', () => {
  beforeEach(async () => {})
  let basicApp: ReturnType<typeof createBasicApp>
  it('should be setup', async () => {
    let basicApp = createBasicApp()
    await basicApp.app.init()
    expect(basicApp.app).toBeTruthy()
    basicApp.app.shutDown()
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
              products: (
                state: Array<{ type: string }> = [],
                action: { type: string }
              ) => [...state, action]
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
      it('should mount navigate sub-* routes', done => {
        const { app, history, products } = createProducts()
        const productRoute = products.createSubRoute(
          'search',
          async () => ({
            component: ProductsComponent,
            // saga: function* ProductsSaga(): any {},
            reducer: {
              productsSearch: productReducer
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
            productsLen: state.productsSearch.products.length
          }),
          {
            onClick: () => console.log('click')
          }
        )(ProductsComponent)
        app.init()
        history.push('/products/search')
      })

      it('should mount/unmount the proper state', async done => {
        const { app, history } = createBasicApp()
        expect(sanitizeState(app.store.getState())).toMatchSnapshot('none')
        await new Promise(r => {
          const productRoute = app.createSubRoute(
            'products',
            async () => ({
              component: ProductsComponent,
              // saga: function* ProductsSaga(): any {},
              reducer: {
                products: productReducer
              }
            }),
            {
              onMount: r,
              onUnMount: () => {
                expect(sanitizeState(app.store.getState())).toMatchSnapshot(
                  'unmount'
                )
                done()
              }
            }
          )
          app.init()
          history.push('/products')
        })
        expect(sanitizeState(app.store.getState())).toMatchSnapshot('mount')
        history.push('')
      })
      it('should mount/unmount the proper state on subRoutes', async done => {
        const { app, history, products } = createProducts()
        expect(sanitizeState(app.store.getState())).toMatchSnapshot('none')
        await new Promise(r => {
          const productRoute = products.createSubRoute(
            'search',
            async () => ({
              component: ProductsComponent,
              // saga: function* ProductsSaga(): any {},
              reducer: {
                productsSearch: productReducer
              }
            }),
            {
              onMount: r,
              onUnMount: () => {
                expect(sanitizeState(app.store.getState())).toMatchSnapshot(
                  'unmount'
                )
                done()
              }
            }
          )
          app.init()
          history.push('/products/search')
        })
        expect(sanitizeState(app.store.getState())).toMatchSnapshot('mount')
        history.push('')
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
        expect(sanitizeState(productsApp.products.getState())).toMatchSnapshot()
        expect(
          sanitizeState(
            productsApp.products.baseSelector(productsApp.products.getState())
          )
        ).toMatchSnapshot()
      })

      it('should connect Products', () => {
        const ConnectedProducts = productsApp.products.connect(
          state => ({
            productsLen: state.products.products.length
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
        ).toThrowErrorMatchingInlineSnapshot(
          `"Cannot read property 'products' of undefined"`
        )
      })
      it('should create a sub route', () => {
        // should not error
        const ConnectedProductSearch = productSearchApp.productSearch.connect(
          state => ({
            title: state.productSearch.test
          })
        )(ProductSearchComponent)
        expect(() =>
          render(
            <Provider store={productSearchApp.app.store}>
              <ConnectedProductSearch />
            </Provider>
          )
        ).toThrowErrorMatchingInlineSnapshot(
          `"Cannot read property 'test' of undefined"`
        )
      })
    })
  })
})
