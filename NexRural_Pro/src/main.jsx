import React from 'react';
import {createRoot} from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App';
import {AppProvider} from './context/AppContext';
createRoot(document.getElementById('root')).render(
<AppProvider><App/></AppProvider>
);