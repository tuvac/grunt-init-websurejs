/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
            ' * <%= pkg.title || pkg.name %>\n' +
            ' * <%= pkg.description %>\n' +
            ' * \n' +
            ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
            ' * @since <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * @version v<%= pkg.version %>\n' +
            ' */\n',
        // Task configuration.
        build: {
            all: {
                dest: 'dist/<%= pkg.name %>.js',
            }
        },
        concat: {
            options: {
            	banner: '<%= banner %>',
				process: function(src) {
					return src.replace(/\/\/\s*BuildExclude\n\r?[\w\W]*?\n\r?/ig, '')
						.replace(/\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, '')
						.replace(/\/\*\s*jshint?[\w\W]*?\n\r?/ig, '')
						.replace(/\/\*\s*global?[\w\W]*?\n\r?/ig, '');
				}            	
            },
            dist: {
                src: ['src/intro.js', 'src/main.js', 'src/outro.js'],
                dest: 'dist/<%= pkg.name %>.js',
            }
        },
		npmcopy: {
			all: {
				options: {
					destPrefix: 'external'
				},
				files: {
					'qunit/qunit.js': 'qunitjs/qunit/qunit.js',
					'qunit/qunit.css': 'qunitjs/qunit/qunit.css',
				}
			}
		}, 
        remotefile: {          
            extend: {
            	url: 'https://raw.githubusercontent.com/tuvac/core-js/master/src/extend.js',
            	dest: 'external/core-js/extend.js'
            }
        },		       
        uglify: {
			options: {
				banner: '<%= banner %>',
				preserveComments: false,
				report: 'min'
			},        
            dist: {
        		src: '<%= concat.dist.dest %>',
        		dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            dev: {
                src: [
                    'src/**/*.js', '!src/intro.js', '!src/outro.js', 'Gruntfile.js', 'test/**/*.js'
                ],
                options: {
                    jshintrc: true
                }
            },
            dist: {
                src: 'dist/<%= pkg.name %>.js'
            }
        },
        qunit: {
            files: ['tests/index.html']
        },
		qunit_junit: {
			options: {
				dest: 'build/reports'
			}
		}      
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-npmcopy');
    grunt.loadNpmTasks('grunt-remotefile');	
	//https://www.npmjs.org/package/grunt-git-release
	grunt.loadNpmTasks('grunt-git-release');
	grunt.loadNpmTasks('grunt-qunit-junit');

    // Default task.
    grunt.registerTask('default', ['npmcopy', 'jshint:dev', 'qunit_junit', 'qunit', 'concat', 'uglify']);
    grunt.registerTask('update-externals', ['npmcopy', 'remotefile']);
    grunt.registerTask('test', ['npmcopy', 'jshint:dev', 'qunit_junit','qunit']);

};