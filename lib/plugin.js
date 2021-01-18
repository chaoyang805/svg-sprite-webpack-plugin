"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.string.starts-with.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.NS = void 0;

var _path = _interopRequireDefault(require("path"));

var _schemaUtils = require("schema-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var schema = {
  type: 'object',
  filename: {
    type: 'string',
    required: true
  }
};
var NS = 'svg-sprite-webpack-plugin';
exports.NS = NS;

var SvgSpriteWebpackPlugin = /*#__PURE__*/function () {
  function SvgSpriteWebpackPlugin(options) {
    _classCallCheck(this, SvgSpriteWebpackPlugin);

    _defineProperty(this, "name", 'SvgSpriteWebpackPlugin');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (0, _schemaUtils.validate)(schema, options, {
      name: this.name
    });
    this.options = options;
    this.sprites = [];
  }

  _createClass(SvgSpriteWebpackPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      var publicPath = compiler.options.output.publicPath;

      if (publicPath.startsWith('.') || publicPath.startsWith('..')) {
        this.output = _path["default"].join(publicPath, this.options.filename);
      } else {
        this.output = _path["default"].join('/', publicPath, this.options.filename);
      }

      var emitHook = function emitHook(compilation) {
        var content = "<svg width=\"0\" height=\"0\" style=\"display: none;\">".concat(_this.sprites.join(''), "</svg>");
        compilation.assets[_this.options.filename] = {
          source: function source() {
            return content;
          },
          size: function size() {
            return content.length;
          }
        };
      };

      var injectPlugin = function injectPlugin(loaderContext) {
        loaderContext[NS] = _this;
      };

      if (compiler.hooks) {
        compiler.hooks.compilation.tap(this.name, function (compilation) {
          if (compilation.hooks.normalModuleLoader) {
            compilation.hooks.normalModuleLoader.tap(_this.name, injectPlugin);
          } else {
            var normalModuleLoader = require('webpack/lib/NormalModule').loader;

            normalModuleLoader.tap(_this.name, injectPlugin);
          }
        });
        compiler.hooks.emit.tap(this.name, emitHook);
      } else {
        compiler.plugin('compilation', function (compilation) {
          compilation.plugin('normal-module-loader', injectPlugin);
        });
        compiler.plugin('emit', emitHook);
      }
    }
  }, {
    key: "addSprite",
    value: function addSprite(iconName, svgSpriteItem) {
      this.sprites.push(svgSpriteItem);
      return "".concat(this.output, "#").concat(iconName);
    }
  }]);

  return SvgSpriteWebpackPlugin;
}();

exports["default"] = SvgSpriteWebpackPlugin;

_defineProperty(SvgSpriteWebpackPlugin, "loader", require.resolve('./loader'));