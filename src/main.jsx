import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes/router.jsx'
import 'remixicon/fonts/remixicon.css'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { Toaster } from 'react-hot-toast';

// --- AXIOS CONFIGURATION START ---
import axios from 'axios';

// Backend-e cookie pathanor jonno eta MUST
axios.defaults.withCredentials = true; 

// Base URL set kore nite paren (Optional, kintu bhalo practice)
axios.defaults.baseURL = 'https://topzfashions-backend.vercel.app'; 
// --- AXIOS CONFIGURATION END ---

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
)