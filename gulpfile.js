/**
* Configuración del gulpFile
**/
config = {
    autoprefixer : true, //Prefijos de navegadores para CSS: compatibilidad con browsers
    minify : true, // Minificado de CSS
    mergeMediaQueries: true, // Unimos el interior de las mediaQueries con las misma condición
    paths : {
        cssPath : 'css',
        cssName: 'style.css',
        sassPath : 'assets/sass',
        sassName: 'style.scss',
    }
}
// Variables que nos facilitan crear las tareas gulp
var sassDir = config.paths.sassPath;
var sassFile = sassDir + '/' + config.paths.sassName;
var cssDir = config.paths.cssPath;
var cssFile = cssDir + '/' + config.paths.cssName;
var jsDir = './assets/js/';
var jsDest = './js';

/**
* Includes: Añadimos las librerías necesarios para compilar el Sass con nuestra configuración
**/
var gulp = require('gulp'); // Gulp
var gulpif = require('gulp-if'); // Condiciones para gulp
var sass = require('gulp-sass'); // Compilador Sass
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var mmq = require('gulp-merge-media-queries');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require("browser-sync").create();

/**
* Config de autoprefixer.
**/
var AUTOPREFIXER_BROWSERS = ['last 2 versions'];

gulp.task('sass', function() {
    return gulp.src([sassFile])
        .pipe(sass({outputStyle: 'compressed'}).on('error', function(err) {
                console.log(err.toString());
                this.emit('end');
            }
        ))
        .pipe(gulpif(config.autoprefixer, autoprefixer({browsers: AUTOPREFIXER_BROWSERS})))
        .pipe(gulpif(config.mergeMediaQueries, mmq()))
        .pipe(gulpif(config.minify, cleanCSS()))
        .pipe(gulp.dest(cssDir))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src([
            './assets/js/libraries/jquery.js',
            './assets/js/libraries/*.js',
            './assets/js/partials/*.js',
            './assets/js/libraries/main.js',
        ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.stream());
});

// Ejecuta funciones cuando el archivo cambia
gulp.task('watch', function() {
    browserSync.init({
        proxy: 'http://example.dev',
        host: 'example.dev',
        open: 'external',
        files: [
            './**/*.php',
            './assets/js/**/*.js',
            '/css/*.css',
            '/assets/sass/**/*.scss'
        ]
    });
    gulp.watch([sassDir + '/*/*.scss',sassFile],['sass']);
    gulp.watch([jsDir + '/*/*.js'],['scripts']);
});

// Default Task
gulp.task('default', ['watch']);
