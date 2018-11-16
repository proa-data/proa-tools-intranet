const pckg = require('./package.json'),
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	gulpSync = $.sync(gulp),
	browserSync = require('browser-sync').create();

const packageName = 'Proa Tools Intranet';

const paths = {
	src: 'src/',
	dist: 'dist/',
	demo: 'demo/',
	tmp: '.tmp/'
};

gulp.task('del:dist', () => delFolder(paths.dist));

gulp.task('scripts:copy', () => processJs());
gulp.task('scripts:min', () => processJs(true));
gulp.task('scripts-locale:copy', () => processLocaleJs());
gulp.task('scripts-locale:min', () => processLocaleJs(true));
gulp.task('scripts', [
	'scripts:copy', 'scripts:min',
	'scripts-locale:copy', 'scripts-locale:min'
]);

gulp.task('build', gulpSync.sync([
	'del:dist',
	'scripts'
]));

gulp.task('del:tmp', () => delFolder(paths.tmp));
gulp.task('index', ['build'], () => gulp.src(paths.demo+'index.html').pipe($.wiredep({devDependencies: true})).pipe($.useref()).pipe($.injectString.replace('{{PACKAGE_NAME}}', packageName)).pipe(gulp.dest(paths.tmp)));
gulp.task('json', () => {
	const jsonFolder = 'json/lang/';
	return gulp.src(paths.demo+jsonFolder+'*.json').pipe(gulp.dest(paths.tmp+jsonFolder));
});
gulp.task('about', () => gulp.src('package.json').pipe($.about()).pipe(gulp.dest(paths.tmp)));

gulp.task('demo', gulpSync.sync([
	'del:tmp',
	['index', 'json', 'about']
]), () => browserSync.init({server: {baseDir: paths.tmp}}));

gulp.task('default', ['build']);

function delFolder(path) {
	return gulp.src(path, {read: false})
		.pipe($.clean());
}

function processJs(minify) {
	const firstJsFile = 'module.js',
		nl = '\n',
		stream = gulp.src(paths.src+'*.js').pipe($.order([firstJsFile,'!'+firstJsFile])).pipe($.concat(pckg.name+'.js')).pipe($.injectString.prepend('/*!'+nl+' * '+packageName+' v'+pckg.version+' ('+pckg.homepage+')'+nl+' */'+nl+nl));
	return (minify?minifyJs(stream):stream).pipe(gulp.dest(paths.dist));
}

function processLocaleJs(minify) {
	const localeFolder = 'locale/',
		stream = gulp.src(paths.src+localeFolder+'*.js');
	return (minify?minifyJs(stream):stream).pipe(gulp.dest(paths.dist+localeFolder));
}

function minifyJs(stream) {
	return stream.pipe($.ngAnnotate()).pipe($.uglify()).pipe($.rename({suffix: '.min'}));
}