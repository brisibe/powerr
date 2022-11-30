import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {QueryClient, QueryClientProvider} from 'react-query'
import { UserContextProvider } from './context/UserContext';
import { UtilsContextProvider } from './context/UtilsContext';
import { ChakraProvider } from '@chakra-ui/react';

const queryClient =new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
    <UtilsContextProvider>
      <UserContextProvider>
       <App />
      </UserContextProvider>
    </UtilsContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
