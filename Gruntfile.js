module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner:
					'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				mangle: true
			},
			build: {
				files: [
					{
						expand: true,
						src: '**/*.js',
						dest: 'dist',
						cwd: 'lib'
					}
				]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify-es');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);
};
