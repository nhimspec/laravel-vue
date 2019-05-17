const path = require('path');
const fs = require('fs-extra');
const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/assets/js');

mix.sass('resources/sass/app.scss', 'public/assets/css')

mix.webpackConfig({
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            '~': path.join(__dirname, './resources/js')
        }
    },
    output: {
        chunkFilename: 'assets/js/[chunkhash].js',
        path: mix.config.hmr ? '/' : path.resolve(__dirname, './public/build')
    }
});

mix.then(() => {
    if (!mix.config.hmr) {
        process.nextTick(() => publishAseets());
    }
});

function publishAseets() {
    const publicDir = path.resolve(__dirname, './public');

    if (mix.inProduction()) {
        fs.removeSync(path.join(publicDir, 'assets'));
    }

    fs.copySync(
        path.join(publicDir, 'build', 'assets'),
        path.join(publicDir, 'assets')
    );
    fs.removeSync(path.join(publicDir, 'build'));
}
