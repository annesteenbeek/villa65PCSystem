module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      code: {
        files: ['*.html', '*.js'],
        options: {
          livereload: true,
        },
      },
      bower: {
        files: ['bower_components/*'],
        tasks: ['wiredep'],
        options: {
          livereload: true,
        },
      },
      configFiles: {
         files: [ 'Gruntfile.js'],
         options: {
           reload: true
         }
       }
      },
     wiredep: {
       task: {
         src: [
           'index.html',   // .html support...
         ],
         options: {
         }
       }
     },
     connect: {
       server: {
         options: {
           port: 9000,
           base: '.'
         }
       }
     }
  })
grunt.loadNpmTasks('grunt-wiredep');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.registerTask('default', ['watch']);
grunt.registerTask('server', "Serve your app", [
                   'connect:server', 'watch' ]);
}