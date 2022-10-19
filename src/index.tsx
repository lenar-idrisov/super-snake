import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './component/Game/Game';
import reportWebVitals from './reportWebVitals';
import {getAdvManager} from './service/advUtils';
import {Provider} from "react-redux";
import {store} from "./store";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
//console.log(window.location);
//console.log(getUrlParams());
const advManager = getAdvManager();
export const AdvContext = createContext(advManager);


advManager.init(() => {
    root.render(
        <Provider store={store}>
            <React.StrictMode>
                <AdvContext.Provider value={advManager}>
                    <App />
                </AdvContext.Provider>
            </React.StrictMode>
        </Provider>
    );
    reportWebVitals();
});