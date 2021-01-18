import SVGO from 'svgo';
import loaderUtils from 'loader-utils';
import { NS } from './plugin';
function apply(content: string) {
  if (!this[NS]) {
    throw new Error(`svg-sprite-loader requires a SvgSpriteWebpackPlugin to be added to webpack config.plugins`);
  }
  const svgo = new SVGO({
    plugins: [
      {
        cleanupIDs: true,
      },
      {
        removeDoctype: true,
      },
      {
        removeTitle: true,
      },
      {
        removeAttrs: {
          attrs: ['fill', 'width', 'height'],
        },
      },
      {
        removeXMLNS: false,
      },
      {
        removeComments: true,
      },
      {
        removeAttributesBySelector: '[fill=*]',
      },
      {
        removeViewBox: false,
      },
    ],
  });
  const cb = this.async();
  svgo
    .optimize(content)
    .then((svg) => {
      const name = loaderUtils.interpolateName(this, '[name]-[contenthash:8]', { content });
      content = svg.data.replace('<svg', `<symbol id="${name}"`).replace('svg>', 'symbol>');
      const path = this[NS].addSprite(name, content);
      const resource = `export default ${JSON.stringify(path)}`;
      cb(null, resource);
    })
    .catch((err) => {
      console.error('optimize svg error', this.resourcePath, err);
      cb(null, `export default ${JSON.stringify('')}`);
    });
}

const isSelfLoader = (l) => /(\/|\\|@)svg-sprite-webpack-plugin\/lib\/loader/.test(l.path);

export function pitch() {
  this.loaders = this.loaders.filter(isSelfLoader);
}

export default apply;
