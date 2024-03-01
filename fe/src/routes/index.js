import 'lib/consoleIgnore';
import 'lib/global';

if (process.env.NODE_ENV == 'development') {
  // require('lib/livereload');
}

switch (window.location.pathname) {
  case '/':           require('./menu.js'); break;
  case '/editor':     require('./editor/index.js'); break;

  // These routes are handled by the server
  case '/tetris':     break;
  case '/synthwave':  break;
  case '/3d-shooter': break;

  default: require('./menu.js');
}
