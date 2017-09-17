import React from 'react';
import { connect } from 'react-redux';

// Components
import MarkdownSource from './components/MarkdownSource';
import MarkdownResult from './components/MarkdownResult';

// Actions
import * as Actions from './actions';

const App = props => {
  return (
    <div id="app">
      <MarkdownSource
        onUpdate={props.updateEditorContent}
      />
      <MarkdownResult
        html={props.html}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    html: state.editor.get('html')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateEditorContent: (md, html) => dispatch(Actions.updateEditorContent(md, html))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
