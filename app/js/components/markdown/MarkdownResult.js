import React from 'react';

const MarkdownResult = ({ html }) => {
  return (
    <div
      id="js-markdown-result"
      className="editor markdown-result"
      dangerouslySetInnerHTML={{__html: html}}
      ></div>
  );
};

export default MarkdownResult;
