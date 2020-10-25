import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { AccountMapProvider } from './AccountMapContext';

ReactDOM.render(<AccountMapProvider><App /></AccountMapProvider>, document.getElementById('root'));
