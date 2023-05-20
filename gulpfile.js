const { src, dest, watch, series, gulp, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babel = require("gulp-babel");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

const connect = require("gulp-connect"); // Runs a local webserver
const open = require("gulp-open"); // Opens a URL in a web browser
const exec = require("child_process").exec; // run command-line programs from gulp
const execSync = require("child_process").execSync; // command-line reports

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

//reloading website
// function browserSyncServe(cb) {
//   browsersync.init({
//     server: {
//       baseDir: ".",
//     },
//     notify: {
//       styles: {
//         top: "auto",
//         bottom: "0",
//       },
//     },
//     browser: "google chrome",
//   });
//   cb();
// }
// function browserSyncReload(cb) {
//   browsersync.reload();
//   cb();
// }

//watch task -- if any changes then do reload
// function watchTask() {
//   watch("*.html", browserSyncReload);
//   watch(
//     ["app/scss/**/*.scss", "app/**/*.js"],
//     series(scssTask, jsTask, browserSyncReload)
//   );
// }
function openBrowser(done) {
  var options = {
    uri: "http://localhost:8080",
  };
  return src("./").pipe(open(options));
  done();
}

// Gulp plugin to run a webserver (with LiveReload)
// https://www.npmjs.com/package/gulp-connect
function server(done) {
  return connect.server({
    root: "./",
    port: 8080,
    debug: true,
  });
  done();
}

// Commit and push files to Git
function git(done) {
  return exec('git add . && git commit -m "netlify deploy" && git push');
  done();
}

// Watch for netlify deployment
function netlify(done) {
  return new Promise(function (resolve, reject) {
    console.log(execSync("netlify watch").toString());
    resolve();
  });
}

// Preview Deployment
function netlifyOpen(done) {
  return exec("netlify open:site");
  done();
}

// Deploy command
exports.deploy = series(git, netlify, netlifyOpen);

// Default Gulp command
exports.default = series(scssTask, jsTask, openBrowser, server);

//default gulp task
//exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);
