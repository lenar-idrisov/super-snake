import React from 'react';
import ReactDOM from 'react-dom/client';
import './scss/App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {getAdvManager} from './service/advUtils';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
//console.log(window.location);
//console.log(getUrlParams());
const advManager = getAdvManager();
const isMobile = (document.querySelector('html') as HTMLHtmlElement).offsetWidth < 500;

advManager.init(() => {
    root.render(
        <React.StrictMode>
            <App
                advManager={advManager}
                isMobile={isMobile}/>
        </React.StrictMode>
    );
    reportWebVitals();
});