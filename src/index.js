import { mergeWith, isArray } from 'lodash';
import WebpackTask from './WebpackTask';

/*
 |----------------------------------------------------------------
 | Webpack
 |----------------------------------------------------------------
 |
 | This task will allow you to use ES2015 code in any browser.
 | It leverages Webpack and Buble to transform and compile
 | your code into a single entry point for the browser.
 |
 */

Elixir.webpack = {
    config: {
        watch: Elixir.isWatching(),
        watchOptions: {
            poll: true,
            aggregateTimeout: 500,
            ignored: /node_modules/
        },
        devtool: Elixir.config.sourcemaps ? 'eval-cheap-module-source-map' : '',
        module: {
            loaders: [{ test: /\.js$/, loader: 'buble', exclude: /node_modules/ }]
        },
        stats: {
            assets: false,
            version: false
        }
    },

    mergeConfig(newConfig) {
        return this.config = mergeWith(this.config, newConfig, (objValue, srcValue) => {
            if (isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        });
    }
};


Elixir.extend('webpack', function(scripts, output, baseDir, options) {
    new WebpackTask(
        'webpack', getPaths(scripts, baseDir, output), options
    );
});


/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  baseDir
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
function getPaths(src, baseDir, output) {
    return new Elixir.GulpPaths()
        .src(src, baseDir || Elixir.config.get('assets.js.folder'))
        .output(output || Elixir.config.get('public.js.outputFolder'), 'all.js');
}
