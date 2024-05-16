import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

require('./helpers/axios')

const root = ReactDOM.createRoot(document.getElementById('root'));
const app = process.env.NODE_ENV === 'development' ? (<React.StrictMode><App/></React.StrictMode>) : <App/>;

root.render(app);
// reportWebVitals();
