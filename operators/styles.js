import gulp from 'gulp'
import path from 'path'
import debug from 'gulp-debug'
import Browser from 'browser-sync'

const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps')
const purgecss = require('gulp-purgecss')
const purgeRules = require('./../.purgecss.safelist')
const headerComment = require('gulp-header-comment')
const clean = require('gulp-clean-css')

function processSass() {
  const browser = Browser.get('Server') ?? Browser.get('Server');

  let stream = gulp.src('./src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(debug({
      title: 'in pipe!'
    }))

  stream = stream
    .pipe(postcss([autoprefixer()]))
    .pipe(debug({
      title: 'Autoprefixer done'
    }))
   
   stream = stream
    .pipe(headerComment({
      file: path.join(__dirname, '../createdby.prikr.scss')
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'))
    .pipe(browser.stream({
      match: '**/*.css'
    }))

  return stream;
}

// Compile SASS files
function compileSass() {
  return gulp.src('./src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css/'))
}


function rejectCss() {
  return gulp.src('./src/css/style.css')
    .pipe(debug({
      title: 'in pipe!'
    }))
    .pipe(rename({
      suffix: '.rejected'
    }))
    .pipe(purgecss({
      content: [
        './*.php',
        './**/*.php',
        './**/**/*.php',
        './**/**/**/*.php',
      ],
      safelist: {
        standard: purgeRules.standard,
        greedy: purgeRules.greedy,
      },
      rejected: true,
    }))
    .pipe(debug({
      title: 'Purge CSS completed'
    }))
    .pipe(gulp.dest('./'))
}

module.exports = {
  processSass,
  compileSass,
  rejectCss
}