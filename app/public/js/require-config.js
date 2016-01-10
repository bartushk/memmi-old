require.config({
    baseUrl: "../js",
    packages: [
        {
            name: "jquery",
            location: "lib",
            main: "jquery-1.11.3.min.js"
        },
        {
            name: "knockout",
            location: "lib",
            main: "knockout-3.4.0.js"
        }
    ],
    paths: {
        'underscore': 'lib/underscore-min'
    }
});