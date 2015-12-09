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

                    var youtubeSearchObject = {
                        'key': apingUtilityHelper.getApiCredentials(apingYoutubeHelper.getThisPlattformString(), "apiKey"),
                        'maxResults': request.items || appSettings.items,
                    };

                    if (request.channelId) { //search for channelID (and optional searchterm)
                        youtubeSearchObject.channelId = request.channelId;
                        if(request.search) {
                            youtubeSearchObject.q = request.search;
                        }

                        youtubeFactory.getVideosFromChannelById(youtubeSearchObject)
                            .success(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, appSettings.model));
                                }
                            });

                    } else if (request.search) { //search for searchterm
                        youtubeSearchObject.q = request.search;

                        youtubeFactory.getVideosFromSearchByString(youtubeSearchObject)
                            .success(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, appSettings.model));
                                }
                            });
                    } else if (request.playlistId) { //search for playlistId
                        youtubeSearchObject.playlistId = request.playlistId;

                        youtubeFactory.getVideosFromPlaylistById(youtubeSearchObject)
                            .success(function (_videosData) {
                                if (_videosData) {
                                    apingController.concatToResults(apingYoutubeHelper.getObjectByJsonData(_videosData, appSettings.model));
                                }
                            });
                    }
                });
            }
        }
    }]);