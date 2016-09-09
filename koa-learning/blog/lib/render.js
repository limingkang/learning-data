
/**
 * Module dependencies.
 */

var views = require('co-views');

// setup views mapping .html
// to the swig template engine
// app.engine('.html', 'swig');
// app.set('view engine', 'html');

module.exports = views(__dirname + '/../views', {
  map: { html: 'swig' }
});