'use strict';

const showdown = require('showdown');
const markdown = new showdown.Converter();
const Mousetrap = require('mousetrap');
const debounce = require('lodash/debounce');

require('mousetrap-global-bind');

const $ = el => document.querySelector(el);

const app = $('#app');
const markdownSource = $('#js-markdown-source');
const markdownResult = $('#js-markdown-result');
const markdownResizer = $('#js-resizer');

let defaultConfigs = {
  resize: {
    min: 200,
    max: 200
  }
};

// Methods
const parseMarkdown = (md, transformers = []) => {
  let result = markdown.makeHtml(md);

  // Transformers
  transformers.forEach(transform => {
    result = transform(result)
  });

  return result;
};

const includeContent = content => document.execCommand('insertText', false, content);
const includeLink = () => includeContent(`[Text here](http://)`);
const includeImage = () => includeContent(`![Alt text here](http://)`);
const includeTab = () => includeContent("\t");

// Events
markdownSource.addEventListener('keyup', debounce(e => {
  const { value } = e.target;

  markdownResult.innerHTML = parseMarkdown(value);
}, 200));

/**
 * It creates shortcuts to execute on markdownSource
 *
 * @param {Array} shortcuts
 * @param {Function} cb
 */
const createShortchut = (shortcuts = [], cb) => {
  Mousetrap(markdownSource).bindGlobal(shortcuts, () => {
    cb();

    markdownResult.innerHTML = parseMarkdown(markdownSource.value);

    return false;
  });
};

createShortchut(['command+shift+l', 'ctrl+shift+l'], includeLink); // Link
createShortchut(['command+shift+i', 'ctrl+shift+i'], includeImage); // Image
createShortchut(['tab'], includeTab); // Tab

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

  console.log(x, total - x, isMin, isMax, resizerWidth, resizerHalf, resizerPosition);
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

const init = () => {
  // Init functions goes here
};

init();
