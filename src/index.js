import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Yunwei from './Yunwei.jsx';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Yunwei />, document.getElementById('root'));
registerServiceWorker();
