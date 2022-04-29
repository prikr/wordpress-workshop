import gulp from 'gulp'
import Browser from 'browser-sync'

import { processSass } from './operators/styles'
import { fonts } from './operators/fonts'

const browser = Browser.create('Server')

export function serve(done) {
  let config = {
    browser: 'Chrome',
    proxy: {
      target: 'localhost',
      ws: true,
    },
    open: 'local',
    notify: false,
    ghostMode: {
        clicks: true,
        forms: true,
        scroll: false
    },
    logLevel: "info",
    open: "external",
    stream: true,
  }
  browser.init(config);
  done();
}

export function watcher() {
  gulp.watch(
    [
      './src/scss/*.scss',
      './src/scss/**/*.scss'
    ],
    { ignoreInitial: false },
    processSass,
  );
  gulp.watch([
    "*.php",
    "./**/*.php",
    "./*/*.php",
    "./**/**/*.php",
    "./templates/*.php",
    "./content/*.php",
    "./content/**/*.php",
    "./modules/*.php",
    "./modules/*/*.php",
    "./modules/*/*/*.php",
    "./templates/*.php",
    "./templates/**/*.php",
    "./templates/**/**/*.php",
    "./woocommerce/*.php",
    "./woocommerce/**/*.php"
  ], function (done) {
    browser.reload();
    done();
  });
}

// Define complex tasks
export const dev   = gulp.series(serve, processSass, watcher);
export const build = gulp.series(processSass);
export const generateFonts = gulp.series(fonts);

export default dev