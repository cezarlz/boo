import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';
import 'mousetrap-global-bind';

class Shortcut extends PureComponent {
  static propTypes = {
    shortcuts: PropTypes.arrayOf(PropTypes.string).isRequired,
    content: PropTypes.string,
    run: PropTypes.func,
  };

  componentDidMount() {
    const { shortcuts, content, run } = this.props;

    if (!shortcuts) return;
    Mousetrap.bindGlobal(shortcuts, () => {
      if (content) document.execCommand('insertText', false, content);

      if (run) run();

      return false;
    });
  }

  componentWillUnmount () {
    Mousetrap.reset();
  }

  render () {
    return null;
  }
}

export default Shortcut;
