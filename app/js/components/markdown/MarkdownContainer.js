import React from 'react';
import { connect } from 'react-redux';

// Components
import MarkdownSource from './MarkdownSource';
import MarkdownResult from './MarkdownResult';
import Shortcut from '../Shortcut';

// Actions
import * as Actions from '../../actions';

// Helpers
import * as Helpers from '../../helpers';

const MarkdownContainer = props => {
  const { html, markdown, updateEditorContent } = props;

  const saveFile = () => {
    const content = document.querySelector('#js-markdown-source').value;

    Helpers.saveMarkdownFile(content);
  };

  return (
    <div id="markdown-container">
      <Shortcut
        shortcuts={['command+shift+l', 'ctrl+shift+l']}
        content={'[Text here](http://)'}
      />
      <Shortcut
        shortcuts={['command+shift+i', 'ctrl+shift+i']}
        content={'![Alt text here](http://)'}
      />
      <Shortcut
        shortcuts={['tab']}
        content={"\t"}
      />
      <Shortcut
        shortcuts={['command+s']}
        run={saveFile}
      />

      <MarkdownSource onUpdate={updateEditorContent} />
      <MarkdownResult html={html} />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    html: state.editor.get('html'),
    markdown: state.editor.get('markdown')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateEditorContent: (md, html) => dispatch(Actions.updateEditorContent(md, html))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MarkdownContainer);
