"use strict";
apingApp.config(['$provide', function ($provide) {

    $provide.constant("apingApiKeys", {
        youtube : [
            //{'apiKey':'<YOUR_YOUTUBE_API_KEY>'},
            {'apiKey':'AIzaSyARYVuV6dho71EMZI6j6-sDEgo8OOnFygM'},
        ]
    });

    $provide.constant("apingDefaultSettings", {
        templateUrl : "aping_design_sample.html",
        items : 20, //items per request
        maxItems: 100, //max items per aping
        orderBy : "timestamp",
        orderReverse : "true",
        model: "social",
        getNativeData: false, // Use "true" for getting native data from plugins
    });

}]);