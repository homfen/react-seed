/**
 * @file app.js
 * @author yankun01
 */

import './css/main.less'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { useScroll } from 'react-router-scroll';
import configureStore from './store';

// Set up the router, wrapping all Routes in the App component
import App from './containers/App';
import Todo from './containers/Todo';
import createRoutes from './routes';

// Import CSS reset and Global Styles
import 'sanitize.css/sanitize.css';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);

const selectLocationState = () => {
    let prevRoutingState;
    let prevRoutingStateJS;

    return (state) => {
        const routingState = state.get('route'); // or state.route

        if (!routingState.equals(prevRoutingState)) {
            prevRoutingState = routingState;
            prevRoutingStateJS = routingState.toJS();
        }

        return prevRoutingStateJS;
    };
};
const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: selectLocationState(),
});

const rootRoute = {
    path: '/',
    component: App,
    indexRoute: { component: Todo },
    childRoutes: createRoutes(store),
};

ReactDOM.render(
    <Provider store={store}>
        <Router
            history={history}
            routes={rootRoute}
            render={
                // Scroll to top when going to a new page, imitating default browser
                // behaviour
                applyRouterMiddleware(useScroll())
            }
        />
    </Provider>,
    document.getElementById('app')
);
