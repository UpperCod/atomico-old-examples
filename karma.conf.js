/**
 * @link https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai
 * @link https://www.npmjs.com/package/karma-rollup-preprocessor
 */
module.exports = function(config) {
	config.set({
		frameworks: ["mocha", "chai"],
		files: [
			{
				pattern: "test/**/*.js",
				watched: true
			}
		],
		preprocessors: {
			"test/**/*.js": ["rollup"]
		},
		rollupPreprocessor: {
			plugins: [
				require("rollup-plugin-node-resolve")({
					extensions: [".js", ".ts"]
				}),
				require("rollup-plugin-postcss")({
					minimize: true
				}),
				require("rollup-plugin-sucrase")({
					production: true,
					exclude: ["node_modules/**"],
					jsxPragma: "h",
					transforms: ["typescript", "jsx"]
				})
			],
			output: {
				format: "iife", // Helps prevent naming collisions.
				name: "test", // Required for 'iife' format.
				sourcemap: "inline" // Sensible for testing.
			}
		},
		reporters: ["progress"],
		port: 9876, // karma web server port
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ["ChromeHeadless"],
		autoWatch: false,
		// singleRun: false, // Karma captures browsers, runs the tests and exits
		concurrency: Infinity
	});
};
