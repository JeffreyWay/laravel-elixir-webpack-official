import fs from 'fs';
import {mergeWith, isArray} from 'lodash';
import filter from 'gulp-filter';

let gulpWebpack;

class WebpackTask extends Elixir.Task {

    /**
     * Create a new JavaScriptTask instance.
     *
     * @param  {string}      name
     * @param  {GulpPaths}   paths
     * @param  {object|null} options
     */
    constructor(name, paths, options) {
        super(name, null, paths);

        this.options = options;

        if (fs.existsSync('webpack.config.js')) {
            this.userWebpackConfig = require(process.cwd()+'/webpack.config.js');
        }
    }


    /**
     * Lazy load the task dependencies.
     */
    loadDependencies() {
        gulpWebpack = require('webpack-stream');
    }


    /**
     * Build up the Gulp task.
     */
    gulpTask() {
        const jsFiles = filter(['**/*.js'], {restore: true});
        return (
            gulp
            .src(this.src.path)
            .pipe(this.webpack())
            .on('error', this.onError())
            .pipe(jsFiles)
            .pipe(this.minify())
            .on('error', this.onError())
            .pipe(jsFiles.restore)
            .pipe(this.saveAs(gulp))
            .pipe(this.onSuccess())
        );
    }


    /**
     * Run the files through Webpack.
     */
    webpack() {
        this.recordStep('Transforming ES2015 to ES5');
        this.recordStep('Writing Source Maps');

        return gulpWebpack(this.mergeConfig(), require('webpack'));
    }


    /**
     * Merge the Webpack config.
     *
     * @return {object}
     */
    mergeConfig() {
        let defaultConfig = {
            output: { filename: this.output.name }
        };
        
        return mergeWith(
            defaultConfig,
            Elixir.webpack.config,
            this.userWebpackConfig,
            this.options,
            (objValue, srcValue) => {
                if (isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }
        );
    }
}


export default WebpackTask;
