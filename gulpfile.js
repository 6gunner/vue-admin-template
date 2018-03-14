const gulp = require('gulp');
const scp = require('gulp-scp2');
const dirs = {
  dest: 'dist'
}
gulp.task('scp', function () {
  return gulp.src(['dist/**/*'], {base: 'dist'})
    // .pipe(scp({
    //   host: '47.97.245.112',
    //   port: 4922,
    //   username: 'root',
    //   password: 'Ld@digital123123',
    //   dest: '/data/src/java/dist'
    // }))
    .on('error', function (err) {
      console.log(err)
    })
})
