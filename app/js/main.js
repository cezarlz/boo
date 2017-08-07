'use strict';

const { markdown } = require('markdown');
const Mousetrap = require('mousetrap');
require('mousetrap-global-bind');

const $ = el => document.querySelector(el);

const markdownEditor = $('#js-markdown-source');
const resultContainer = $('#js-markdown-result');

// Methods
const parse = (container, content) => {
  container.innerHTML = markdown.toHTML(content);
};

const includeContent = (container, content) => insertAtCaret(container, content);

const includeLink = container => includeContent(container, `[Text here](http://)`);

const includeImage = container => includeContent(container, `![Alt text here](http://)`);

const insertAtCaret = (txtarea, text) => {
  var scrollPos = txtarea.scrollTop;
  var caretPos = txtarea.selectionStart;

  var front = (txtarea.value).substring(0, caretPos);
  var back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);
  txtarea.value = front + text + back;
  caretPos = caretPos + text.length;
  txtarea.selectionStart = caretPos;
  txtarea.selectionEnd = caretPos;
  txtarea.focus();
  txtarea.scrollTop = scrollPos;
};

// Events
markdownEditor.addEventListener('keyup', e => {
  const { value } = e.target;

  parse(resultContainer, value);
});

// Prevent links
Array.from(resultContainer.querySelectorAll('a')).forEach(el => {
  el.addEventListener('click', e => e.preventDefault(), true);
});

// Shortcuts
// Link
Mousetrap(markdownEditor).bindGlobal(['command+shift+l', 'ctrl+shift+l'], () => {
  includeLink(markdownEditor);
  parse(resultContainer, markdownEditor.value);

  return false;
});

// Image
Mousetrap(markdownEditor).bindGlobal(['command+shift+i', 'ctrl+shift+i'], () => {
  includeImage(markdownEditor);
  parse(resultContainer, markdownEditor.value);

  return false;
});