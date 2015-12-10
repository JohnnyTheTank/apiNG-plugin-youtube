"use strict";
apingApp.config(['$provide', function ($provide) {

    $provide.constant("apingApiKeys", {
        youtube : [
            {'apiKey':"AIzaSyAlCcA8eKCm0qMc2Uo2kO5p8Z8UkEp2Cfc"}
        ]
    });

    $provide.constant("apingDefaultSettings", {
        templateUrl : "aping_design_sample.html",
        items : 20, //items per request
        maxItems: 100, //max items per aping
        orderBy : "timestamp",
        orderReverse : "true",
        model: "social",
    });

}]);