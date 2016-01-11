"use strict";
apingApp.config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys : {
            //...
            youtube : [
                {'apiKey':'<YOUR_YOUTUBE_API_KEY>'},
            ]
            //...
        }
    });
}]);