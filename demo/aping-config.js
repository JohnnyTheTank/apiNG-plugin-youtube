"use strict";
angular.module('jtt_aping').config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys : {
            //...
            youtube : [
                //{'apiKey':'<YOUR_YOUTUBE_API_KEY>'},
                {'apiKey':'AIzaSyARYVuV6dho71EMZI6j6-sDEgo8OOnFygM'},
            ]
            //...
        }
    });
}]);