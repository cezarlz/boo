import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import {
  editor,
  configs
} from './js/reducers';

const container = document.querySelector('#container');

const store = createStore(combineReducers({
  editor,
  configs
}));

const render = () => {
  const App = require('./js/app').default;

  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>
    ,container
  );
};

render();
if (module.hot) { module.hot.accept(render); }
