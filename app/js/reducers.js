import * as Constants from './constants';
import { Map } from 'immutable';

const initialState = () => new Map();

export const editor = (state = initialState(), { type, payload }) => {
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
