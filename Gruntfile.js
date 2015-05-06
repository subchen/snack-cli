module.exports = function(grunt) {

    var jsfiles = [
        'Gruntfile.js',
        'index.js',
        'lib/**/*.js',
        'test/**/*.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        trimtrailingspaces: {
            main: {
                src: jsfiles
            }
        },
        jsbeautifier: {
            options: {
                config: '.jsbeautifyrc'
            },
            files: jsfiles
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: jsfiles
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            files: jsfiles
        }
    });

    grunt.loadNpmTasks('grunt-trimtrailingspaces');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.registerTask('sa', ['trimtrailingspaces', 'jsbeautifier', 'jshint', 'jscs']);

};
