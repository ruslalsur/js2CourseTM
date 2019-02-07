let gulp = require('gulp'), // Сам gulp
    sass = require('gulp-sass'), // Модуль для компиляции scss
    minifyJs = require('gulp-terser'), // Минификация js
    autoPrefixer = require('gulp-autoprefixer'), // Вендорные префиксы
    bs = require('browser-sync'), // Сервер
    htmlMin = require('gulp-htmlmin'), // Минификация html
    rename = require('gulp-rename'), // Rename
    delFiles = require('del'), // Delete files
    cssMinify = require('gulp-csso'), //  Минификация css
    babel = require('gulp-babel'), // babel
    imgOpti = require('gulp-image-optimize'); //минификация изображений

//Delete files
gulp.task('clean', () => {
    return delFiles(['dist/**', '!dist'])
});

// HTML
gulp.task('html', () => {
    return gulp.src('app/html/**/*.html') // Выбрали файлы с которыми работаем
        .pipe(htmlMin({
            collapseWhitespace: true  // Минифицируем файл
        }))
        .pipe(gulp.dest('dist')) // Сохраняем файл
        .pipe(bs.reload({stream: true}))
});

//SASS
gulp.task('sass', () => {
    // return gulp.src('app/sass/**/*.+(scss|sass)')
    // return gulp.src('app/img/**/*.+(jpg|png|gif|svg)')
    // return gulp.src(['app/img/**/*.+(jpg|png|gif|svg)', 'app/content/*.jpg'])
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssMinify())
        .pipe(gulp.dest('dist/css'))
        .pipe(bs.reload({stream: true}))
});

// IMAGE
gulp.task('img', () => {
    return gulp.src('app/img/**/*.+(jpg|png|gif|svg)')
        .pipe(imgOpti())
        .pipe(gulp.dest('dist/img'))
        
});

// минимизация и копирование разных там библиотек .css
gulp.task('other_css', () => {
   return gulp.src('app/lib/normalize.css')
       .pipe(cssMinify())
       .pipe(gulp.dest('dist/css'))
       
});


// JS6 - es6
gulp.task('js:es6', () => {
    return gulp.src(['app/js/**/*.js', 'app/bower_components/jquery/dist/jquery.min.js'])
        .pipe(minifyJs())
        .pipe(gulp.dest('dist/js'))
        .pipe(bs.reload({stream: true}))
});

// JS5 - babel
gulp.task('js:babel', () => {
    return gulp.src('app/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minifyJs())
        .pipe(rename({
            suffix: '.es5'
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(bs.reload({stream: true}))
});

// JSON
gulp.task('json', () => {
    return gulp.src('app/jsons/**/*.json')
        .pipe(gulp.dest('dist/jsons'))
        
});

// slick-carousel
gulp.task('slick', () => {
    return gulp.src('app/bower_components/slick-carousel/slick/**')
        .pipe(gulp.dest('dist/components/slick'))
});


// Следим за html
gulp.task('html:watch', () => {
    return gulp.watch('app/html/**/*.html', gulp.series('html'));
});

// Следим за sass
gulp.task('sass:watch', () => {
    return gulp.watch('app/sass/**/*.sass', gulp.series('sass'));
});

// Следим за js
gulp.task('js:watch', () => {
    return gulp.watch('app/js/**/*.js', gulp.series('js:es6'));
});




// Server
gulp.task('server', () => {
    return bs({
        server: {
            baseDir: 'dist'
        },
        browser: 'Safari'
        // browser: 'Google Chrome'
        // browser: 'Firefox'
    })
});

// Переопределяем задачу по-умолчанию
gulp.task('default', gulp.series('clean', gulp.parallel('html', 'sass', 'other_css', 'slick', 'img', 'json', 'js:es6'), gulp.parallel('html:watch', 'sass:watch', 'js:watch', 'server')));