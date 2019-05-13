var gulp = require('gulp');
var ts = require('gulp-typescript');

const tsproj = ts.createProject('tsconfig.json');

gulp.task('build', () => {
	return gulp.src('src/**/*.ts')
	.pipe(tsproj())
	.pipe(gulp.dest('./dist/'));
});