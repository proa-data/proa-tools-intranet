const pckg = require('./package.json'),
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),
	gulpSync = $.sync(gulp),
	injStr = $.injectString,
	browserSync = require('browser-sync').create();

const baseName = pckg.name,
	packageName = 'Proa Tools Intranet';

const paths = {
	src: 'src/',
	dist: 'dist/',
	demo: 'demo/',
	tmp: '.tmp/'
};
paths.srcScripts = paths.src+'js/';

const nl = '\n';

gulp.task('del:dist', () => delFolder(paths.dist));

gulp.task('scripts:copy', () => processJs());
gulp.task('scripts:min', () => processJs(minifyJs));
gulp.task('scripts-locale:copy', () => processLocaleJs());
gulp.task('scripts-locale:min', () => processLocaleJs(minifyJs));
gulp.task('scripts', [
	'scripts:copy', 'scripts:min',
	'scripts-locale:copy', 'scripts-locale:min'
]);

gulp.task('build', gulpSync.sync(['del:dist', 'scripts']));

gulp.task('del:tmp', () => delFolder(paths.tmp));
gulp.task('index', ['build'], () => gulp.src(paths.demo+'index.html').pipe($.wiredep({devDependencies: true})).pipe($.useref()).pipe(injStr.replace('{{PACKAGE_NAME}}', packageName)).pipe(gulp.dest(paths.tmp)));
gulp.task('styles', () => gulp.src(paths.src+'less/index.less').pipe(injStr.prepend('// bower:less'+nl+'// endbower'+nl)).pipe($.wiredep()).pipe($.less()).pipe(gulp.dest(paths.tmp+'styles/')));
gulp.task('fonts', () => {
	const fontsFolder = 'fonts/';
	return gulp.src(paths.src+fontsFolder+'*').pipe(gulp.dest(paths.tmp+fontsFolder));
});
gulp.task('json', () => {
	const jsonFolder = 'json/lang/';
	return gulp.src(paths.demo+jsonFolder+'*').pipe(gulp.dest(paths.tmp+jsonFolder));
});
gulp.task('about', () => gulp.src('package.json').pipe($.about()).pipe(gulp.dest(paths.tmp)));

gulp.task('demo', gulpSync.sync([
	'del:tmp',
	['index', 'styles', 'fonts', 'json', 'about']
]), () => browserSync.init({server: {baseDir: paths.tmp}}));

gulp.task('default', ['build']);

function delFolder(path) {
	return gulp.src(path, {read: false})
		.pipe($.clean());
}

function processJs(extraProcess) {
	const firstJsFile = 'module.js';
	return processStream(extraProcess, gulp.src(paths.srcScripts+'*').pipe($.order([firstJsFile,'!'+firstJsFile])).pipe($.concat(baseName+'.js')).pipe(injStr.prepend('/*!'+nl+' * '+packageName+' v'+pckg.version+' ('+pckg.homepage+')'+nl+' */'+nl+nl)));
}

function minifyJs(stream) {
	return stream.pipe($.ngAnnotate()).pipe($.uglify({output: {comments: '/^!/'}})).pipe($.rename({suffix: '.min'}));
}

function processLocaleJs(extraProcess) {
	const localeFolder = 'locale/';
	return processStream(extraProcess, gulp.src(paths.srcScripts+localeFolder+'*'), localeFolder);
}

function processStream(process, stream, subpath) {
	return (process?process(stream):stream).pipe(gulp.dest(paths.dist+(subpath||'')));
}