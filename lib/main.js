'use strict';

requirejs.config({
    baseUrl: 'lib',

    // This is to load jquery without the globals.
    map: {
        '*': { 'jquery': 'jquery-private' },
        'jquery-private': { 'jquery': 'jquery' }
    },

    paths: {
        vendor: '../vendor',
        jquery: '../vendor/jquery'
    }
});

requirejs(['canvas'], function (canvas) {
    canvas.init({ selector: '#canvas' });
});
