import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../../store'
import App from '.'

it('renders without crashing', () => {
  // Jest jsdom does not support windows.scrollTo so we mock it
  window.scrollTo = jest.fn()

  const div = document.createElement('div')
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)

  window.scrollTo.mockClear()
})
