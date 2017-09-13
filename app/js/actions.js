import * as Constants from './constants';

export const resizeEditor = payload => ({
  type: Constants.RESIZE_EDITOR,
  payload
});

export const updateEditorContent = (markdown, html) => ({
  type: Constants.UPDATE_EDITOR_CONTENT,
  payload: {
    markdown,
    html
  }
});
