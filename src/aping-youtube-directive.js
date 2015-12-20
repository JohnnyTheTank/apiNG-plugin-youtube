"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-youtube-plugin
 @licence MIT
 */

var jjtApingYoutube = angular.module("jtt_aping_youtube", ['jtt_youtube'])
    .directive('apingYoutube', ['youtubeFactory', 'apingYoutubeHelper', 'apingUtilityHelper', function (youtubeFactory, apingYoutubeHelper, apingUtilityHelper) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingYoutube, apingYoutubeHelper.getThisPlattformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };
                    if(typeof appSettings.getNativeData !== "undefined") {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    //create requestObject for api request call
                    var requestObject = {
                        key: apingUtilityHelper.getApiCredentials(apingYoutubeHelper.getThisPlattformString(), "apiKey"),
                    };

                    if(typeof request.items !== "undefined") {
                        requestObject.maxResults = request.items;
                    } else {
                        requestObject.maxResults = appSettings.items;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if(requestObject.maxResults < 0 || isNaN(requestObject.maxResults)) {
                        requestObject.maxResults = undefined;
                    }

                    // the api has a limit of 50 items per request
                    if(requestObject.maxResults > 50) {
                        requestObject.maxResults = 50;
                    }


                    if (request.channelId) { //search for channelID (and optional searchterm)
                        requestObject.channelId = request.channelId;
                        if(request.search) {
                            requestObject.q = request.search;
                        }

                        youtubeFactory.getVideosFromChannelById(requestObject)
                            .success(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, helperObject));
                                }
                            });

                    } else if (request.search || (request.lat && request.lng)) { //search for searchterm and or location

                        if(request.search) {
                            requestObject.q = request.search;
                        }

                        if(request.lat && request.lng) {
                            requestObject.location = request.lat + "," + request.lng;
                        }

                        if(request.distance) {
                            requestObject.locationRadius = request.distance;
                        }

                        youtubeFactory.getVideosFromSearchByParams(requestObject)
                            .success(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, helperObject));
                                }
                            });
                    } else if (request.playlistId) { //search for playlistId
                        requestObject.playlistId = request.playlistId;

                        youtubeFactory.getVideosFromPlaylistById(requestObject)
                            .success(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, helperObject));
                                }
                            });
                    }
                });
            }
        }
    }]);
