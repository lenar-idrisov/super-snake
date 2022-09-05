import React from 'react';
import ReactDOM from 'react-dom';
import './scss/App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {getAdvManager} from './service/advUtils';

//console.log(window.location);
//console.log(getUrlParams());
const advManager = getAdvManager();

advManager.init(_ => {
    ReactDOM.render(
        <React.StrictMode>
            <App advManager={advManager}/>
        </React.StrictMode>,
        document.getElementById('root')
    );
    reportWebVitals();
});


/*ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);*/