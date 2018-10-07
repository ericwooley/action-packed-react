import * as React from 'react'
import { init } from './fe'
import { JSDOM } from 'jsdom'
import { createMemoryHistory } from 'history'
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
class HomeComponent extends React.Component<any> {
  render() {
    return <h1>HomeComponent</h1>
  }
}

class ProfileComponent extends React.Component<any> {
  render() {
    return <h1>ProfileComponent</h1>
  }
}
class ProductsComponent extends React.Component<any> {
  render() {
    return <h1>ProductsComponent</h1>
  }
}
class ProductSearchComponent extends React.Component<any> {
  render() {
    return <h1>ProductSearchComponent</h1>
  }
}
describe('the wooley way fe', () => {
  it('should look like this', () => {
    const rootEl = dom.window.document.getElementById('root')
    if (!rootEl) throw new Error('Could not create root')
    const app: any = init({
      initialReducers: {},
      history: createMemoryHistory(),
      rootEl
    })
    const friends = app.createSubRoute('friends', () => ({
      component: HomeComponent,
      saga: function* HomeSaga(): any {},
      reducer: () => null
    }))
    const profile = app.createSubRoute('profile/:id', () => ({
      component: ProfileComponent,
      saga: function* ProfileSaga(): any {},
      reducer: () => null
    }))
    const products = app.createSubRoute('products', () => ({
      component: ProductsComponent,
      saga: function* ProductsSaga(): any {},
      reducer: () => null
    }))
    const productSearch = products.createSubRoute('search/:terms', () => ({
      component: ProductSearchComponent,
      saga: function* ProductsSearchSaga(): any {},
      reducer: () => null
    }))
  })
})
