import fs from 'fs';
import { remote } from 'electron';

const dialog = remote.dialog;

export const showSaveDialog = (options = {}, cb) => {
  dialog.showSaveDialog(remote.getCurrentWindow(), options, filePath => {
    if (!filePath) return;

    cb(filePath);
  });
};

export const writeFile = (filePath, content, cb) => {
  fs.writeFile(filePath, content, err => {
    if (cb) return cb(err);
  });
};

export const saveMarkdownFile = (content, options = {}, cb) => {
  const fileOptions = {
    defaultPath: 'new-file.md',
    filters: [
      { name: 'Markdown', extensions: ['md'] }
    ],
    ...options
  };

  showSaveDialog(fileOptions, filePath => {
    if (!filePath) return;

    writeFile(filePath, content, cb);
  });
};
