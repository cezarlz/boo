import React from 'react';
import showdown from 'showdown';

const markdown = new showdown.Converter();

const MarkdownSource = props => {
  const parseMarkdownToHtml = content => markdown.makeHtml(content);

  const onInput = e => {
    const source = e.target.value;
    const html = parseMarkdownToHtml(source);

    return props.onUpdate(source, html);
  };

  return (
    <div className="editor">
      <textarea
        id="js-markdown-source"
        className="markdown-source"
        onInput={onInput}
        autoFocus
      ></textarea>
    </div>
  );
};

MarkdownSource.defaultProps = {
  onUpdate: () => {},
};

export default MarkdownSource;
