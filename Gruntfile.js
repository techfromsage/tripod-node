'use strict';

module.exports = function (grunt) {
    var globalConfig = {};
    // Project configuration.
    grunt.initConfig({
        globalConfig: globalConfig,
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    timeout: 10000
                },
                src: ["test/**/*.js"]
            },
            "test-x-unit": {
                options: {
                    reporter: "xunit",
                    timeout: 10000
                },
                src: ["test/**/*.js"]
            },
            filter: {
                src: ["test/**/*_test.js"],
                options: {
                    reporter: "spec",
                    grep: '<%= globalConfig.filter%>'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['index.js']
            }
        },
        jsbeautifier: {
            modify: {
                src: ['Gruntfile.js', 'index.js'],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            verify: {
                src: ['Gruntfile.js', 'index.js'],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'mochaTest']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Default task.
    grunt.registerTask('default', ['jshint', 'mochaTest:test']);
    grunt.registerTask('bamboo', ['jshint', 'mochaTest:test-x-unit']);
    grunt.registerTask('clean', ['jshint', 'jsbeautifier:modify']);
    grunt.registerTask('verify', ['jshint', 'jsbeautifier:verify']);
    grunt.registerTask('filtertest', 'Runs tests based on pattern specified', function (taskName, pattern) {
        // set a variable on global config
        globalConfig.filter = pattern;
        // internally call the mochaTest:filter target
        grunt.task.run(taskName + ':filter');
        // to use this cli do   grunt filtertest:mochaTest:<pattern>
    });
};