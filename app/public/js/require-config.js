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
        },
        {
            name: "showdown",
            location: "lib",
            main: "showdown.min.js"
        }
    ],
    paths: {
        'underscore': 'lib/underscore-min',
        'bbcode': 'lib/bbcode.min',
        'bcrypt': 'lib/bcrypt.min',
        'sha512': 'lib/sha512'
    },
    shim: {
        "bbcode": { "exports": "bbcode" },
        'sha512': { 'exports': 'jsSHA' }
    }
});
