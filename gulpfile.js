const gulp = require('gulp');
const scp = require('gulp-scp2');
const dirs = {
  dest: 'dist'
}
gulp.task('scp', function () {
  return gulp.src(['dist/**/*'], {base: 'dist'})
    .pipe(scp({
      host: '127.0.0.1',
      port: 22,
      username: 'xxx',
      password: 'xxx',
      dest: '/root/boms/boms-manager'
    }))
    .on('error', function (err) {
      console.log(err)
    })
})
