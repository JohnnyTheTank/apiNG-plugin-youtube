"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-youtube-plugin
 @licence MIT
 */

jjtApingYoutube.service('apingYoutubeHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
    this.getThisPlattformString = function () {
        return "youtube";
    };

    this.getThisPlattformLink = function () {
        return "https://www.youtube.com/";
    };

    this.getYoutubeIdFromUrl = function (_url) {
        var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        return _url.match(rx)[1] || false;
    };

    this.getYoutubeImageFromId = function (_youtubeId, size) {
        switch (size) {
            case 'default':
            case 'maxresdefault':
            case 'mqdefault':
            case 'sddefault':
                return "https://img.youtube.com/vi/" + _youtubeId + "/" + size + ".jpg";
                break;

            case 'hqdefault':
            default:
                return "https://img.youtube.com/vi/" + _youtubeId + "/hqdefault.jpg";
                break;
        }
    };

    this.getObjectByJsonData = function (_data, _model) {
        var requestResults = [];
        if (_data) {
            var _this = this;
            if (_data.items) {
                angular.forEach(_data.items, function (value, key) {
                    var tempResult = _this.getItemByJsonData(value, _model);
                    if(tempResult) {
                        requestResults.push(tempResult);
                    }
                });
            }
        }
        return requestResults;
    };

    this.getItemByJsonData = function (_item, _model) {
        var returnObject = {};
        if (_item && _model) {
            switch (_model) {
                case "social":
                    returnObject = this.getSocialItemByJsonData(_item);
                    break;
                case "video":
                    returnObject = this.getVideoItemByJsonData(_item);
                    break;

                default:
                    return false;
            }
        }
        return returnObject;
    };

    this.getSocialItemByJsonData = function (_item) {
        var socialObject = apingModels.getNew("social", "youtube");
        $.extend(true, socialObject, {
            blog_name: _item.snippet.channelTitle || false,
            blog_id: _item.snippet.channelId || false,
            blog_link: this.getThisPlattformLink()+"channel/" + _item.snippet.channelId,
            intern_type: _item.id.kind,
            intern_id: _item.id.videoId || _item.snippet.resourceId.videoId,
            timestamp: apingTimeHelper.getTimestampFromDateString(_item.snippet.publishedAt, 1000, 7200),
        });
        socialObject.date_time = new Date(socialObject.timestamp);
        if (_item.snippet.title !== "" && _item.snippet.description !== "") {
            socialObject.caption = _item.snippet.title;
            socialObject.text = _item.snippet.description;
        } else {
            if (_item.snippet.title !== "") {
                socialObject.caption = _item.snippet.title;
            } else {
                socialObject.caption = _item.snippet.description;
            }
        }
        if (_item.id.kind == "youtube#video") {
            socialObject.type = "video";
        } else if (_item.kind == "youtube#playlistItem" && _item.snippet.resourceId && _item.snippet.resourceId.kind == "youtube#video") {
            socialObject.type = "video";
            socialObject.position = _item.snippet.position;
        }
        socialObject.img_url = this.getYoutubeImageFromId(socialObject.intern_id);
        socialObject.post_url = this.getThisPlattformLink()+"watch?v=" + socialObject.intern_id;
        return socialObject;
    };

    this.getVideoItemByJsonData = function (_item) {
        var videoObject = apingModels.getNew("video", "youtube");
        $.extend(true, videoObject, {
            blog_name: _item.snippet.channelTitle || false,
            blog_id: _item.snippet.channelId || false,
            blog_link: this.getThisPlattformLink()+"channel/" + _item.snippet.channelId,
            intern_type: _item.id.kind,
            intern_id: _item.id.videoId || _item.snippet.resourceId.videoId,
            timestamp: apingTimeHelper.getTimestampFromDateString(_item.snippet.publishedAt, 1000, 7200),
        });
        videoObject.date_time = new Date(videoObject.timestamp);
        if (_item.snippet.title !== "" && _item.snippet.description !== "") {
            videoObject.caption = _item.snippet.title;
            videoObject.text = _item.snippet.description;
        } else {
            if (_item.snippet.title !== "") {
                videoObject.caption = _item.snippet.title;
            } else {
                videoObject.caption = _item.snippet.description;
            }
        }
        videoObject.img_url = this.getYoutubeImageFromId(videoObject.intern_id);
        videoObject.post_url = this.getThisPlattformLink()+"watch?v=" + videoObject.intern_id;
        videoObject.position = _item.snippet.position;
        videoObject.markup = '<iframe width="1280" height="720" src="https://www.youtube.com/embed/'+videoObject.intern_id+'?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';

        return videoObject;
    };
}]);