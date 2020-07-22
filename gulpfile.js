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
  return gulp
    .src("./src/scss/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

function jsTask() {
  return browserify({
    entries: ["./src/js/app.js"],
    debug: true,
  })
    .transform(babelify)
    .bundle()
    .pipe(plumber())
    .pipe(source("app.js"))
    .pipe(gulp.dest("./dist/js"))
    .pipe(browserSync.stream());
}

function browserSyncTask(done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    port: 4000,
    open: true,
  });

  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function buildCss() {
  return gulp
    .src("./dist/css/style.css")
    .pipe(cssnano())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("./dist/css"));
}

function buildJs() {
  return gulp
    .src("./dist/js/app.js")
    .pipe(uglify())
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest("./dist/js"));
}

function watchAllFiles() {
  gulp.watch("./src/scss/**/*.scss", sassTask);
  gulp.watch("./src/js/**/*.js", jsTask);
  gulp.watch(["./**/*.html"], browserSyncReload);
}

gulp.task(
  "watch",
  gulp.parallel(sassTask, jsTask, watchAllFiles, browserSyncTask)
);
gulp.task("sass", sassTask);
gulp.task("js", jsTask);
gulp.task(
  "production",
  gulp.series("js", "sass", gulp.parallel(buildCss, buildJs))
);
