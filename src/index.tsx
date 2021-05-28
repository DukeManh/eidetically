import React from 'react';
import ReactDOM from 'react-dom';
import 'firebaseui/dist/firebaseui.css';
import './styles/index.scss';
import App from './App';

import 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
