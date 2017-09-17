import * as Constants from './constants';
import { Map } from 'immutable';

const initialState = (initial = {}) => new Map(initial);

const editorInitial = initialState({
  markdown: '',
  html: ''
});

export const editor = (state = editorInitial, { type, payload }) => {
  switch (type) {
    case Constants.UPDATE_EDITOR_CONTENT:
      return state.merge({
        markdown: payload.markdown,
        html: payload.html
      });
    default:
      return state;
  }
};

const configInitial = initialState({
  theme: Constants.THEME_DEFAULT,
});

export const configs = (state = configInitial, { type, payload }) => {
  switch (type) {
    case Constants.GET_CONFIGS:
    default:
      return state;
  }
};
