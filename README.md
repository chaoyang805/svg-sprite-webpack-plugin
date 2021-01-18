# svg-sprite-webpack-plugin

A webpack plugin and loader for combining individual svg icons into a single svg sprite file, just like css image sprite.

## Fundamental

This tool loads your svg icons into a single svg file containing several `<symbol>` nodes. Then you can refrence this svg icons via attribute `xlink:href="/img/icons.svg#icon-avatar"` in `<use>` node of the `<svg></svg>` tag. For example, assume you have these icons:

```xml
<!-- icon-avatar.svg -->
<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.3388 10.7239C2.03978 9.99693 2.99645 9.58325 4 9.58325H10C11.0035 9.58325 11.9602 9.99693 12.6612 10.7239C13.3613 11.4499 13.75 12.429 13.75 13.4444V14.9999C13.75 15.4141 13.4142 15.7499 13 15.7499C12.5858 15.7499 12.25 15.4141 12.25 14.9999V13.4444C12.25 12.8095 12.0066 12.206 11.5814 11.7651C11.1572 11.3251 10.5878 11.0833 10 11.0833H4C3.41225 11.0833 2.8428 11.3251 2.41856 11.7651C1.99343 12.206 1.75 12.8095 1.75 13.4444V14.9999C1.75 15.4141 1.41421 15.7499 1 15.7499C0.585786 15.7499 0.25 15.4141 0.25 14.9999V13.4444C0.25 12.429 0.638707 11.4499 1.3388 10.7239Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7 1.75C5.78283 1.75 4.75 2.78116 4.75 4.11111C4.75 5.44106 5.78283 6.47222 7 6.47222C8.21717 6.47222 9.25 5.44106 9.25 4.11111C9.25 2.78116 8.21717 1.75 7 1.75ZM3.25 4.11111C3.25 2.00462 4.90346 0.25 7 0.25C9.09654 0.25 10.75 2.00462 10.75 4.11111C10.75 6.2176 9.09654 7.97222 7 7.97222C4.90346 7.97222 3.25 6.2176 3.25 4.11111Z" fill="white"/>
</svg>
```

```xml
<!-- icon-delete.svg -->
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 3.40002C0.5 3.12388 0.723858 2.90002 1 2.90002H13C13.2761 2.90002 13.5 3.12388 13.5 3.40002C13.5 3.67617 13.2761 3.90002 13 3.90002H1C0.723858 3.90002 0.5 3.67617 0.5 3.40002Z" fill="#EF4545"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.66659 1.5C5.42956 1.5 5.21148 1.58522 5.05826 1.72312C4.90678 1.85945 4.83325 2.03237 4.83325 2.2V2.9H9.16658V2.2C9.16658 2.03237 9.09306 1.85945 8.94158 1.72312C8.78836 1.58522 8.57027 1.5 8.33325 1.5H5.66659ZM10.1666 2.9V2.2C10.1666 1.73111 9.95916 1.29358 9.61054 0.979825C9.26366 0.667634 8.80347 0.5 8.33325 0.5H5.66658C5.19636 0.5 4.73617 0.667634 4.38929 0.979825C4.04068 1.29358 3.83325 1.73111 3.83325 2.2V2.9H2.33325C2.05711 2.9 1.83325 3.12386 1.83325 3.4V11.8C1.83325 12.2689 2.04068 12.7064 2.38929 13.0202C2.73617 13.3324 3.19636 13.5 3.66659 13.5H10.3333C10.8035 13.5 11.2637 13.3324 11.6105 13.0202C11.9592 12.7064 12.1666 12.2689 12.1666 11.8V3.4C12.1666 3.12386 11.9427 2.9 11.6666 2.9H10.1666ZM2.83325 3.9V11.8C2.83325 11.9676 2.90678 12.1405 3.05826 12.2769C3.21148 12.4148 3.42956 12.5 3.66659 12.5H10.3333C10.5703 12.5 10.7884 12.4148 10.9416 12.2769C11.0931 12.1405 11.1666 11.9676 11.1666 11.8V3.9H2.83325Z" fill="#EF4545"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.6665 5.90015C5.94265 5.90015 6.1665 6.124 6.1665 6.40015V10.0001C6.1665 10.2763 5.94265 10.5001 5.6665 10.5001C5.39036 10.5001 5.1665 10.2763 5.1665 10.0001V6.40015C5.1665 6.124 5.39036 5.90015 5.6665 5.90015Z" fill="#EF4545"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.33325 5.90015C8.60939 5.90015 8.83325 6.124 8.83325 6.40015V10.0001C8.83325 10.2763 8.60939 10.5001 8.33325 10.5001C8.05711 10.5001 7.83325 10.2763 7.83325 10.0001V6.40015C7.83325 6.124 8.05711 5.90015 8.33325 5.90015Z" fill="#EF4545"/>
</svg>
```

after use this plugin and loader in you webpack project, these svg icons will be combined to a new svg file like below:

```xml
<svg width="0" height="0" style="display: none;">
  <symbol id="icon-avatar-2ce6a7dd">
    <!-- your svg path data... -->
  </symbol>
  <symbol id="icon-delete-3ab0bd92">
    <!-- your svg path data... -->
  </symbol>
  <!-- more symbol nodes... -->
</svg>
```

you can use these icons in html

```html
<svg>
  <use xlink:href="img/icons.svg#icon-avatar-2ce6a7dd"></use>
</svg>
```

You need first import it in you js code, of course.

```javascript
import iconAvatar from '@/assets/icon-avatar.svg' // iconAvatar = 'img/icons.svg#icon-avatar-2ce6a7dd'
```

## Usage

### config webpack

```javascript
// webpack.config.js
const SvgSpritePlugin = require('svg-sprite-webpack-plugin');

module.exports = {
  ...
  module: {
    rules: [
      ...
      // add svg-sprite-loader here before any other svg loaders
      {
        test: /\.svg$/,
        use: SvgSpritePlugin.loader,
      },
      ...
    ],
  },
  plugins: [
    new SvgSpritePlugin({
      // filename represents the output svg file name. it only supports static name for now
      filename: 'img/icons.svg',
    }),
    ...
  ]
  ...
}
```

If you are using vue-cli，create a vue.config.js file and add code:

```javascript
// vue.config.js
const path = require('path')
const SvgSpritePlugin = require('svg-sprite-webpack-plugin');
module.exports = {
  ...,
  chainWebpack(config) {
    config.plugin('svg-sprite').use(SvgSpritePlugin, [{ filename: 'img/icons.svg' }])
    config.module.rule('svg')
      .test(/\.svg$/i)
        .use('svg-sprite')
        .before('file-loader')
        .loader(SvgSpritePlugin.loader)
      .end()
  },
  ...
}
```

### Use in Vue component

```vue
<template>
<svg class="icon icon-avatar">
  <use :xlink:href="iconAvatar"></use>
</svg>
</template>
<script>
	import iconAvatar from '@/assets/icon-avatar.svg'
  export default {
    name: 'icon-avatar',
    data() {
    	return {
      	iconAvatar  
      };
    },
  }
</script>
<style lang="scss" scoped>
  .icon {
    fill: currentColor;
    width: 1em;
    height: 1em;
    vertical-align: middle;
  }
  .icon-avatar {
    color: grey;
    font-size: 18px;
  }
</style>
```

### Use in plain javascript

first import icon in you javascript code

```javascript
import iconAvatar from '@/assets/icon-avatar.svg' // iconAvatar = 'img/icons.svg#icon-avatar-2ce6a7dd'

// do not forget svg tag is created by createElementNS method.
const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', iconAvatar);

svgIcon.appendChild(use);
document.body.appendChild(svgIcon);
```
