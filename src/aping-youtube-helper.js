"use strict";

angular.module("jtt_aping_youtube").service('apingYoutubeHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
    this.getThisPlatformString = function () {
        return "youtube";
    };

    this.getThisPlatformLink = function () {
        return "https://www.youtube.com/";
    };

    this.convertYoutubeDurationToSeconds = function (duration) {
        var a = duration.match(/\d+/g);

        if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
            a = [0, a[0], 0];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
            a = [a[0], 0, a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
            a = [a[0], 0, 0];
        }
        duration = 0;

        if (a.length == 3) {
            duration = duration + parseInt(a[0]) * 3600;
            duration = duration + parseInt(a[1]) * 60;
            duration = duration + parseInt(a[2]);
        }

        if (a.length == 2) {
            duration = duration + parseInt(a[0]) * 60;
            duration = duration + parseInt(a[1]);
        }

        if (a.length == 1) {
            duration = duration + parseInt(a[0]);
        }
        return duration
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

    this.getObjectByJsonData = function (_data, _helperObject) {
        var requestResults = [];
        if (_data && _data.data) {
            var _this = this;
            if (_data.data.items) {
                angular.forEach(_data.data.items, function (value, key) {
                    var tempResult;
                    if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                        tempResult = value;
                    } else {
                        tempResult = _this.getItemByJsonData(value, _helperObject.model);
                    }
                    if (tempResult) {
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
        angular.extend(socialObject, {
            blog_name: _item.snippet.channelTitle || undefined,
            blog_id: _item.snippet.channelId || undefined,
            blog_link: this.getThisPlatformLink() + "channel/" + _item.snippet.channelId,
            intern_type: _item.id.kind,
            intern_id: _item.id.videoId || ((_item.snippet.resourceId && _item.snippet.resourceId.videoId) ? _item.snippet.resourceId.videoId : _item.id),
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

        socialObject.source = '<iframe width="1280" height="720" src="https://www.youtube.com/embed/' + socialObject.intern_id + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';

        socialObject.img_url = this.getYoutubeImageFromId(socialObject.intern_id);
        socialObject.thumb_url = this.getYoutubeImageFromId(socialObject.intern_id, 'default');
        socialObject.native_url = this.getYoutubeImageFromId(socialObject.intern_id);
        socialObject.post_url = this.getThisPlatformLink() + "watch?v=" + socialObject.intern_id;

        if (_item.statistics) {
            if (_item.statistics.commentCount && _item.statistics.commentCount > 0) {
                socialObject.comments = _item.statistics.commentCount;
            }

            if (_item.statistics.likeCount && _item.statistics.likeCount > 0) {
                socialObject.likes = _item.statistics.likeCount;
            }
        }

        return socialObject;
    };

    this.getVideoItemByJsonData = function (_item) {
        var videoObject = apingModels.getNew("video", "youtube");
        angular.extend(videoObject, {
            blog_name: _item.snippet.channelTitle || undefined,
            blog_id: _item.snippet.channelId || undefined,
            blog_link: this.getThisPlatformLink() + "channel/" + _item.snippet.channelId,
            intern_type: _item.id.kind,
            intern_id: _item.id.videoId || ((_item.snippet.resourceId && _item.snippet.resourceId.videoId) ? _item.snippet.resourceId.videoId : _item.id),
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
        videoObject.thumb_url = this.getYoutubeImageFromId(videoObject.intern_id, 'default');
        videoObject.native_url = this.getYoutubeImageFromId(videoObject.intern_id);
        videoObject.post_url = this.getThisPlatformLink() + "watch?v=" + videoObject.intern_id;
        videoObject.position = _item.snippet.position;
        videoObject.markup = '<iframe width="1280" height="720" src="https://www.youtube.com/embed/' + videoObject.intern_id + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>';

        if (_item.statistics) {
            if (_item.statistics.commentCount && _item.statistics.commentCount > 0) {
                videoObject.comments = _item.statistics.commentCount;
            }

            if (_item.statistics.likeCount && _item.statistics.likeCount > 0) {
                videoObject.likes = _item.statistics.likeCount;
            }
        }

        if (_item.contentDetails && _item.contentDetails.duration) {
            videoObject.duration = this.convertYoutubeDurationToSeconds(_item.contentDetails.duration);
        }

        return videoObject;
    };
}]);