import React from 'react';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import router from './routes/approuter.jsx';
import { Provider } from 'react-redux';
import { store } from './api/store/store';

import { ThemeProvider } from './context/ThemeContext.jsx';
import "./App.css"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className=''>
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            containerStyle={{ zIndex: 99999 }}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
            }}
          />
        </div>
      </ThemeProvider>
      
    </Provider>
  )

}
export default App;
