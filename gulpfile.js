const gulp = require("gulp");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const babelify = require("babelify");
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const source = require("vinyl-source-stream");
const browserify = require("browserify");

function sassTask() {
  console.log("ddd");

  return gulp
    .src("./src/sass/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

function jsTask() {}

function browserSyncTask(done) {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    port: 3000,
    open: true
  });

  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watchAllFiles() {
  gulp.watch("./src/sass/**/*.scss", sassTask);
  gulp.watch("./src/js/**/*.js", jsTask);
  gulp.watch(["./**/*.html"], browserSyncReload);
}

gulp.task("watch", gulp.parallel(watchAllFiles, browserSyncTask));
