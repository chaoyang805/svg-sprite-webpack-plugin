export type PluginOptions = {
  filename: string;
};
declare class SvgSpriteWebpackPlugin {
  constructor(options: PluginOptions);
  static loader: string;
}

export default SvgSpriteWebpackPlugin;
