import React from 'react'
import "./index.css"
import ReactDOM from 'react-dom/client'
import CustomRoute from "./CustomRoute.jsx"
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './store/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
      <Provider store={store}>
        <CustomRoute />
      </Provider>
    {/* </React.StrictMode> */}
  </BrowserRouter>
)
