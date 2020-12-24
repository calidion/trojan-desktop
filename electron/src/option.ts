import * as path from 'path';

export default {
  icon: {
    file: path.resolve(
      path.join(__dirname, '../../frontend/assets/icons/favicon.png')
    ),
  },
  local: {
    host: 'http://localhost:4200',
    file: path.join(__dirname, '../../frontend/dist/index.html'),
  },
  electron: {
    module: require(path.join(
      __dirname,
      '../../electron/node_modules/electron'
    )),
  },
};
