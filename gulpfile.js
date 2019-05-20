const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const plumber = require('gulp-plumber')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')

// compile styles taks
function css() {
  return gulp
    .src('./src/styles/**/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' })).on('error', sass.logError)
    .pipe(gulp.dest('./src/styles/'))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('./src/styles/'))
    .pipe(browserSync.stream())
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './src',
    },
    port: 8080,
  })
  gulp.watch('./src/styles/**/*.scss', css)
  gulp.watch('./src/**/*.html').on('change', browserSync.reload)
  gulp.watch('./src/scripts/**/*.js').on('change', browserSync.reload)
}

exports.css = css
exports.watch = watch