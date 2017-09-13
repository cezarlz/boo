import { createStore,combineReducers } from 'redux';
import showdown from 'showdown';
import Mousetrap from 'mousetrap';
import * as MousetrapGlobalBind from 'mousetrap-global-bind';
import throttle from 'lodash/throttle';

// Project dependencies
import defaultConfigs from './js/configs';

// Reducers
import {
  editor
} from './js/reducers';

// Actions
import {
  resizeEditor,
  updateEditorContent
} from './js/actions';

const $ = el => document.querySelector(el);

const app = $('#app');
const markdownSource = $('#js-markdown-source');
const markdownResult = $('#js-markdown-result');
const markdownResizer = $('#js-resizer');
const markdown = new showdown.Converter();

const store = createStore(
  combineReducers({
    editor
  })
);

// Methods
const parseMarkdown = (md, transformers = []) => {
  let result = markdown.makeHtml(md);

  // Transformers
  transformers.forEach(transform => {
    result = transform(result)
  });

  return result;
};

// Events
markdownSource.addEventListener('input', throttle(e => {
  const { value } = e.target;

  const htmlResult = parseMarkdown(value);

  store.dispatch(updateEditorContent(value, htmlResult));
}, 200));

/**
 * It creates shortcuts to execute on markdownSource
 *
 * @param {Array} shortcuts
 * @param {Function} cb
 */
const createShortchut = (shortcuts = [], content = '') => {
  Mousetrap(markdownSource).bindGlobal(shortcuts, () => {
    document.execCommand('insertText', false, content)

    return false;
  });
};

createShortchut(['command+shift+l', 'ctrl+shift+l'], `[Text here](http://)`); // Link
createShortchut(['command+shift+i', 'ctrl+shift+i'], `![Alt text here](http://)`); // Image
createShortchut(['tab'], "\t"); // Tab

// Twin Scroll
const getScrollPosition = (scroll, height, targetHeight) => scroll * targetHeight / height;

const markdownResultScroll = e => {
  const { scrollHeight, scrollTop, clientHeight } = markdownResult;

  markdownSource.scrollTop = getScrollPosition(scrollTop, scrollHeight - clientHeight, markdownSource.scrollHeight - markdownSource.clientHeight);
};
markdownResult.addEventListener('mouseover', () => markdownResult.addEventListener('scroll', markdownResultScroll, false));
markdownResult.addEventListener('mouseleave', () => markdownResult.removeEventListener('scroll', markdownResultScroll, false));


const markdownSourceScroll = () => {
  const { scrollHeight, scrollTop, clientHeight } = markdownSource;

  markdownResult.scrollTop = getScrollPosition(scrollTop, scrollHeight - clientHeight, markdownResult.scrollHeight - markdownResult.clientHeight);
};
markdownSource.addEventListener('mouseover', () => markdownSource.addEventListener('scroll', markdownSourceScroll, false));
markdownSource.addEventListener('mouseleave', () => markdownSource.removeEventListener('scroll', markdownSourceScroll, false));

// Resize editor
let clicking = false;

const resizeEditors = (x, total = window.innerWidth, configs = defaultConfigs) => {
  const isMin = x < configs.resize.min;
  const isMax = (total - x) < configs.resize.max;

  if (isMin || isMax) return;

  const resizerWidth = markdownResizer.scrollWidth;
  const resizerHalf = resizerWidth / 2;
  const resizerPosition = x - (resizerWidth / 2);

  markdownResizer.style.left = `${resizerPosition}px`;

  // Source
  markdownSource.style.width = `${x}px`; // A
  markdownResult.style.width = `${total - x}px`; // B

  // console.log(x, total - x, isMin, isMax, resizerWidth, resizerHalf, resizerPosition);
};

markdownResizer.addEventListener('mousedown', () => {
  clicking = true;
});

app.addEventListener('mouseup', () => {
  clicking = false;

  app.classList.remove('is-dragging');
});

app.addEventListener('mousemove', e => {
  if (!clicking) return;

  app.classList.add('is-dragging');

  resizeEditors(e.pageX);
});

window.addEventListener('resize', () => {
  resizeEditors(markdownSource.clientWidth);
});

const render = state => {
  // Update editor
  markdownResult.innerHTML = state.editor.get('html');
};

store.subscribe(() => render(store.getState()));
