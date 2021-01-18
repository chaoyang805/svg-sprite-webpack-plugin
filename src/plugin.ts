import path from 'path';
import { validate } from 'schema-utils';
import type { PluginOptions } from '../types/index';
const schema = {
  type: 'object',
  filename: {
    type: 'string',
    required: true,
  },
};
export const NS = 'svg-sprite-webpack-plugin';

export default class SvgSpriteWebpackPlugin {
  public static loader = require.resolve('./loader');
  public name = 'SvgSpriteWebpackPlugin';
  public options: PluginOptions;
  public sprites: string[];
  public output!: string;
  public constructor(options: PluginOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    validate(schema, options, { name: this.name });
    this.options = options;
    this.sprites = [];
  }

  public apply(compiler) {
    const publicPath = compiler.options.output.publicPath as string;
    if (publicPath.startsWith('.') || publicPath.startsWith('..')) {
      this.output = path.join(publicPath, this.options.filename);
    } else {
      this.output = path.join('/', publicPath, this.options.filename);
    }
    const emitHook = (compilation) => {
      const content = `<svg width="0" height="0" style="display: none;">${this.sprites.join('')}</svg>`;
      compilation.assets[this.options.filename] = {
        source: () => content,
        size: () => content.length,
      };
    };
    const injectPlugin = (loaderContext) => {
      loaderContext[NS] = this;
    };
    if (compiler.hooks) {
      compiler.hooks.compilation.tap(this.name, (compilation) => {
        if (compilation.hooks.normalModuleLoader) {
          compilation.hooks.normalModuleLoader.tap(this.name, injectPlugin);
        } else {
          const normalModuleLoader = require('webpack/lib/NormalModule').loader;
          normalModuleLoader.tap(this.name, injectPlugin);
        }
      });
      compiler.hooks.emit.tap(this.name, emitHook);
    } else {
      compiler.plugin('compilation', (compilation) => {
        compilation.plugin('normal-module-loader', injectPlugin);
      });
      compiler.plugin('emit', emitHook);
    }
  }
  private addSprite(iconName: string, svgSpriteItem: string) {
    this.sprites.push(svgSpriteItem);
    return `${this.output}#${iconName}`;
  }
}
