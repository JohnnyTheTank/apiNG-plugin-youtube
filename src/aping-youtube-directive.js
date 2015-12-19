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
                        'key': apingUtilityHelper.getApiCredentials(apingYoutubeHelper.getThisPlattformString(), "apiKey"),
                        'maxResults': request.items || appSettings.items,
                    };

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

                    } else if (request.search) { //search for searchterm
                        requestObject.q = request.search;

                        youtubeFactory.getVideosFromSearchByString(requestObject)
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