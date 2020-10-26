---
sidebar: auto
prev: false
next: ./getting-started
---

# Installation

## Possible ways to install

### NPM

This is the recommended way to install this Plugin.

Install with npm as a dependency:

```bash
npm i vue-responsive-grid-layout

# or with yarn, respectively:
yarn add vue-responsive-grid-layout
```

Then include the package in your application and install the plugin:

```javascript
import VueResponsiveGridLayout from 'vue-responsive-grid-layout';

Vue.use(VueResponsiveGridLayout);
```

## Options

When using as plugin, you can pass options to change the component names.

```javascript
Vue.use(VueResponsiveGridLayout, {
  vueGridItemName: 'vue-grid-item',
  vueGridLayoutName: 'vue-grid-layout',
  vueResponsiveGridLayoutName: 'vue-responsive-grid-layout',
  widthProviderName: 'width-provider',
})
```

### Nuxt Module

:::tip Hint
Only relevant for users of the [Nuxt](https://nuxtjs.org) framework
:::

First install from NPM, then add `vue-responsive-grid-layout/nuxt` to modules section of `nuxt.config.js`

```javascript
{
  modules: ['vue-responsive-grid-layout/nuxt']
}
```

### CDN

Soon

## Using the components locally

If you don't want to register the components globally, don't do `Vue.use('VueResponsiveGridLayout')`

Instead, import the component(s) in those components that you need them in and register them locally:

```javascript
import { VueGridLayout, VueResponsiveGridLayout, VueGridItem } from 'vue-responsive-grid-layout';

export default {
  components: {
    VueGridLayout,
    VueResponsiveGridLayout,
    VueGridItem,
  },
}
```

## Builds

VueResponsiveGridLayout ships in three different Builds.

| Type           | File                                    | Usage                                                    |
| -------------- | --------------------------------------- | -------------------------------------------------------- |
| UMD (minified) | `vue-responsive-grid-layout.umd.min.js` | To be included in a browser                              |
| UMD            | `vue-responsive-grid-layout.umd.js`     | To be included in a browser. Non minified for debugging. |
| ESM            | `vue-responsive-grid-layout.esm.js`     | For usage with bundlers that _do_ support ESModules.     |
| Commonjs       | `vue-responsive-grid-layout.common.js`  | For usage with bundlers that don't support ESModule      |

_Notes_

### UMD

When including VueResponsiveGridLayout from a CDN, make sure you get one of the of UMD builds.

**About CDNs**: `unpkg.com` and `jsdelivr.com` will load the umd lib automatically.

If you include it from other sources directly in your HTML, make sure to import `vue-responsive-grid-layout/dist/vue-responsive-grid-layout.umd.min.js`

### Commonjs

This is the default main file of the package.

Webpack 1 doesn't support commonjs, neither do some dev tools, like jest doesn't either. So this is a sensible default to use.

### ESM

Webpack >=2, rollup and parcel all can natively understand ESModules, so this is the best build to use with those bundlers.

The ESM version is marked as the default export of `package.json` for consumers that understand the `"module"` field in `package.json` (which is true for all the aforementioned bundlers), so doing `import VueResponsiveGridLayout from 'vue-responsive-grid-layout'` will automatically give you the ESM build if the bundler supports it.