import * as React from 'react'
import { createApp, BareBonesState } from './'
import { createMemoryHistory } from 'history'
import { mount, render, ReactWrapper } from 'enzyme'
import { Provider } from 'react-redux'
import { createActionPack, createReducerFromActionPack } from './createReducer'
import { createRouteComposer } from './routeMatcher'
export const mountAlert = <IProps, T>(
  C: React.ComponentType<IProps>,
  { didMount, willUnmount }: { didMount?: () => any; willUnmount?: () => any }
) => {
  return class RouteAlerter extends React.Component<IProps> {
    componentDidMount() {
      if (didMount) didMount()
    }
    componentWillUnmount() {
      if (willUnmount) willUnmount()
    }
    render() {
      const { onMount, ...restProps } = this.props as any
      return <C {...restProps} />
    }
  }
}
const noop = () => null

const sanitizeState = (state: BareBonesState): BareBonesState => ({
  ...state,
  _route: {
    ...state._route,
    history: state._route.history.map((item, idx) => ({
      ...item,
      key: `${idx}`
    })),
    currentLocation: {
      ...state._route.currentLocation,
      key: '<key>'
    }
  }
})
class ProductsComponent extends React.Component<{
  productsLen: number
  test: string
  onClick: () => any
  children?: React.ReactChildren
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
type OnMountWrap = (r: ReturnType<typeof mount>) => any
const createBasicApp = (onMountWrap?: OnMountWrap) => {
  const history = createMemoryHistory()
  const app = createApp({
    useHashHistory: false,
    RouteNotFoundComponent: () => <h1>Not Found</h1>,
    LoadingComponent: () => <div>Loading...</div>,
    layout: props => <>{props.children}</>,
    history: history,
    initialState: {
      str: '',
      num: 15
    },
    initialReducers: {
      str: () => 'test',
      num: () => 12
    }
  })
  const wrapper = mount(<app.AppComponent />)
  if (onMountWrap) onMountWrap(wrapper)
  return {
    history,
    app
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
  (state, action) => ({
    ...productsState,
    products: [...state.products, action.payload]
  })
)

const productReducer = createReducerFromActionPack(productsState, { addProduct })
const createProducts = (baseApp = createBasicApp()) => {
  const { app, history } = baseApp
  const route = createRouteComposer('products')
  const products = app.createSubRoute(route, async () => ({ products: productReducer }))
  products.setComponent(async () => ({ children }: any) => (
    <ProductsComponent productsLen={3} test="" onClick={noop}>
      {children}
    </ProductsComponent>
  ))
  return {
    app,
    history,
    products
  }
}
const createProductsSearch = (parentRoute = createProducts()) => {
  const { products, app, history } = parentRoute
  const productSearch = products.createSubRoute(
    createRouteComposer<{ terms: string }>('search/:terms'),
    async () => ({
      producer: noop,
      productSearch: (state: { test: string }, action: { type: string; payload: string }) => ({
        ...state,
        test: action.payload
      })
    })
  )
  return { productSearch, products, app, history }
}
describe('the wooley way fe', () => {
  let baseApp: ReturnType<typeof createBasicApp>
  let wrapper: ReactWrapper
  beforeEach(async done => {
    baseApp = createBasicApp(r => {
      wrapper = r as any
      done()
    })
    await baseApp.app.init()
  })
  it('should be setup', () => {
    expect(baseApp.app).toBeTruthy()
    expect(sanitizeState(baseApp.app.baseSelector(baseApp.app.store.getState()))).toMatchSnapshot()
  })
  afterEach(() => baseApp.app.shutDown())
  describe('child route', () => {
    describe('with matching route', () => {
      it('should mount on navigate', async done => {
        const productRoute = baseApp.app.createSubRoute('products', async () => ({
          products: (state: Array<{ type: string }> = [], action: { type: string }) => [
            ...state,
            action
          ]
        }))
        productRoute.register()
        const ConnectedProducts = productRoute.connect(
          state => {
            return {
              productsLen: state.products.length,
              test: ''
            }
          },
          {
            onClick: () => console.log('click')
          }
        )(ProductsComponent)
        const ComponentWithMountAlert = mountAlert(ConnectedProducts, {
          didMount: () => {
            expect(wrapper.html()).toMatchSnapshot('products-full-dom')
            expect(
              render(
                <Provider store={baseApp.app.store}>
                  <ConnectedProducts />
                </Provider>
              ).html()
            ).toMatchSnapshot()
            done()
          }
        })
        productRoute.setComponent(async () => ComponentWithMountAlert)

        let stateTest = productRoute.createSubRoute('test', async () => ({ testRed: () => 'test' }))
        stateTest.connect(state => ({
          products: state.products.length
        }))
        stateTest.setComponent(async () => () => <div>tst</div>)
        await baseApp.app.init()
        baseApp.history.push('/products')
      })
      it('should mount navigate sub-* routes', async done => {
        const { app, history, products } = createProducts(baseApp)
        const productRoute = products.createSubRoute('search', async () => ({
          productsSearch: productReducer
        }))
        productRoute.setComponent(async () =>
          mountAlert(() => <ProductSearchComponent title="test" />, {
            didMount: () => {
              expect(wrapper.html()).toMatchSnapshot('products full dom')
              expect(
                render(
                  <Provider store={app.store}>
                    <ConnectedProducts test="" />
                  </Provider>
                ).html()
              ).toMatchSnapshot()
              done()
            }
          })
        )
        productRoute.register()
        const ConnectedProducts = productRoute.connect(
          state => ({
            productsLen: state.productsSearch.products.length
          }),
          {
            onClick: () => console.log('click')
          }
        )(ProductsComponent)
        await app.init()
        history.push('/products/search')
      })

      it('should mount/unmount the proper state', async done => {
        const { app, history } = baseApp
        expect(sanitizeState(app.store.getState())).toMatchSnapshot('none')
        await new Promise(async r => {
          const productRoute = app.createSubRoute('products', async () => ({
            products: productReducer
          }))
          productRoute.setComponent(async () =>
            mountAlert(() => <ProductsComponent onClick={noop} test="" productsLen={12} />, {
              didMount: r,
              willUnmount: () => {
                expect(wrapper.html()).toMatchSnapshot('full after product unmount')
                expect(sanitizeState(app.store.getState())).toMatchSnapshot('unmount')
                done()
              }
            })
          )
          productRoute.register()
          await app.init()
          history.push('/products')
        })
        expect(sanitizeState(app.store.getState())).toMatchSnapshot('mount')
        history.push('')
      })
      it('should mount/unmount the proper state on subRoutes', async done => {
        const { app, history, products } = createProducts()
        expect(sanitizeState(app.store.getState())).toMatchSnapshot('none')
        await new Promise(async r => {
          const productsSubRoute = products.createSubRoute('search', async () => ({
            productsSearch: productReducer
          }))
          productsSubRoute.setComponent(async () =>
            mountAlert(() => <ProductSearchComponent title="search" />, {
              didMount: r,
              willUnmount: () => {
                expect(wrapper.html()).toMatchSnapshot('after unmount')
                expect(sanitizeState(app.store.getState())).toMatchSnapshot('unmount')
                done()
              }
            })
          )
          productsSubRoute.register()
          await app.init()
          history.push('/products/search')
        })
        expect(sanitizeState(app.store.getState())).toMatchSnapshot('mount')
        history.push('/')
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
          sanitizeState(productsApp.products.baseSelector(productsApp.products.getState()))
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
        ).toThrowErrorMatchingInlineSnapshot(`"Cannot read property 'products' of undefined"`)
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
    describe('Links', () => {
      let productsApp: ReturnType<typeof createProducts>
      let productSearchApp: ReturnType<typeof createProductsSearch>
      beforeEach(async () => {
        productsApp = createProducts()
        productSearchApp = createProductsSearch()
        await productSearchApp.app.init()
      })
      it('should render a link', () => {
        expect(
          mount(
            <Provider store={productsApp.app.store}>
              <productsApp.products.Link>products</productsApp.products.Link>
            </Provider>
          ).html()
        ).toMatchInlineSnapshot(`"<a href=\\"/products\\">products</a>"`)
      })
      it('should navigate a link', async () => {
        const spy = jest.fn()
        productsApp.history.listen(spy)
        const link = mount(
          <Provider store={productsApp.app.store}>
            <productsApp.products.Link />
          </Provider>
        )
        link.find('a').simulate('click')
        expect(link.html()).toMatchInlineSnapshot(`"<a href=\\"/products\\"></a>"`)
        await new Promise(r => setTimeout(r, 10))
        expect(spy).toHaveBeenCalledTimes(1)
        expect({ ...spy.mock.calls[0][0], key: '<key>' }).toMatchSnapshot()
        expect(spy.mock.calls[0][1]).toMatchInlineSnapshot(`"PUSH"`)
      })
      it('should navigate a link with replace', async () => {
        const spy = jest.fn()
        productSearchApp.history.listen(spy)
        const link = mount(
          <Provider store={productSearchApp.app.store}>
            <productSearchApp.productSearch.Link replace={true} terms="whatever" />
          </Provider>
        )
        link.find('a').simulate('click')
        await new Promise(r => setTimeout(r, 10))
        expect(spy).toHaveBeenCalledTimes(1)
        expect({ ...spy.mock.calls[0][0], key: '<key>' }).toMatchSnapshot()
        expect(spy.mock.calls[0][1]).toMatchInlineSnapshot(`"REPLACE"`)
      })
    })
  })
})
