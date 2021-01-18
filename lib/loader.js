"use strict";

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pitch = pitch;
exports["default"] = void 0;

var _svgo = _interopRequireDefault(require("svgo"));

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _plugin = require("./plugin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function apply(content) {
  var _this = this;

  if (!this[_plugin.NS]) {
    throw new Error("svg-sprite-loader requires a SvgSpriteWebpackPlugin to be added to webpack config.plugins");
  }

  var svgo = new _svgo["default"]({
    plugins: [{
      cleanupIDs: true
    }, {
      removeDoctype: true
    }, {
      removeTitle: true
    }, {
      removeAttrs: {
        attrs: ['fill', 'width', 'height']
      }
    }, {
      removeXMLNS: false
    }, {
      removeComments: true
    }, {
      removeAttributesBySelector: '[fill=*]'
    }, {
      removeViewBox: false
    }]
  });
  var cb = this.async();
  svgo.optimize(content).then(function (svg) {
    var name = _loaderUtils["default"].interpolateName(_this, '[name]-[contenthash:8]', {
      content: content
    });

    content = svg.data.replace('<svg', "<symbol id=\"".concat(name, "\"")).replace('svg>', 'symbol>');

    var path = _this[_plugin.NS].addSprite(name, content);

    var resource = "export default ".concat(JSON.stringify(path));
    cb(null, resource);
  })["catch"](function (err) {
    console.error('optimize svg error', _this.resourcePath, err);
    cb(null, "export default ".concat(JSON.stringify('')));
  });
}

var isSelfLoader = function isSelfLoader(l) {
  return /(\/|\\|@)svg-sprite-webpack-plugin\/lib\/loader/.test(l.path);
};

function pitch() {
  this.loaders = this.loaders.filter(isSelfLoader);
}

var _default = apply;
exports["default"] = _default;