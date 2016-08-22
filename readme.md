# Laravel Elixir Webpack Integration

This extension brings Webpack support to Laravel Elixir, version 6 and up.

## Step 1: Install

```js
npm install laravel-elixir-webpack-official --save-dev
```

## Step 2: Usage

Similar to Browserify, the `webpack` method may be used to compile and bundle [ECMAScript 2015](https://babeljs.io/docs/learn-es2015/) into plain JavaScript.
This function accepts a file, relative to the `resources/assets/js` directory, and generates a single bundled file in the `public/js` directory:

```javascript
elixir(function(mix) {
    mix.webpack('app.js');
});
```

To choose a different output or base directory, simply specify your desired paths as the second and third arguments, respectively.

```javascript
elixir(function(mix) {
    mix.webpack('app.js', 'public/dist', 'app/assets/js');
});
```

This will compile `app/assets/js/app.js` to `public/dist/app.js`.

If you'd like to leverage more of Webpack's functionality, Elixir will read any `webpack.config.js` file in your project root, and [factor its configuration](https://webpack.github.io/docs/configuration.html) into the build process. Alternatively, you may pass your Webpack-specific configuration as the fourth argument to `mix.webpack()`.

## Step 3: Plugins

If you've created a plugin, and need to hook your own Webpack config into Elixir's defaults, add the following to your script:

```js
Elixir.webpack.mergeConfig({
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime'],
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }]
    }
});
```

`Elixir.webpack.mergeConfig(newConfig)` will recursively merge your provided configuration with ours. It also properly merges any nested  arrays, so as not to override important default configuration. For example, in the code snippet above, the addition of the Vue loader will not overwrite the default loaders that we provide.