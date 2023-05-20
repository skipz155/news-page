const { src, dest, watch, series, gulp } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const deploy = require("gulp-gh-pages");

//sass task
function scssTask() {
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

function jsTask() {
  return src("app/js/script.js", { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
}

/**
 * Push build to gh-pages
 */
function deployment() {
  gulp.task("deploy", function () {
    return gulp.src("./dist/**/*").pipe(deploy());
  });
}

//reloading website
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
    notify: {
      styles: {
        top: "auto",
        bottom: "0",
      },
    },
    browser: "google chrome",
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

//watch task -- if any changes then do reload
function watchTask() {
  watch("*.html", browserSyncReload);
  watch(
    ["app/scss/**/*.scss", "app/**/*.js"],
    series(scssTask, jsTask, browserSyncReload)
  );
}

//default gulp task
exports.default = series(
  scssTask,
  jsTask,
  browserSyncServe,
  watchTask,
  deployment
);
