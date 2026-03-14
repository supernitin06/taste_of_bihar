// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'
// import './i18n'

// import { Provider } from 'react-redux'
// import { store } from './api/store/store'
// import { ThemeProvider } from './context/ThemeContext'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <ThemeProvider>
//         <App />
//       </ThemeProvider>
//     </Provider>
//   </React.StrictMode>
// )

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'

import { Provider, useSelector } from 'react-redux'
import { store } from './api/store/store'
import { ThemeProvider } from './context/ThemeContext'
import { SocketProvider } from './context/SocketContext'

/* Wrapper to read authToken and restaurantId from Redux */
const SocketWrapper = ({ children }) => {
  const { authToken, user } = useSelector((state) => state.auth)
  return (
    <SocketProvider authToken={authToken} restaurantId={user?.restaurantId}>
      {children}
    </SocketProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SocketWrapper>
          <App />
        </SocketWrapper>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
