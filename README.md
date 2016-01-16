[logo]: http://aping.io/logo/320/aping-plugin.png "apiNG Plugin"
![apiNG][logo]

[![npm version](https://badge.fury.io/js/aping-plugin-youtube.png)](https://badge.fury.io/js/aping-plugin-youtube)
[![Bower version](https://badge.fury.io/bo/apiNG-plugin-youtube.png)](https://badge.fury.io/bo/apiNG-plugin-youtube)

**_apiNG-plugin-youtube_** is a [Youtube Data API v3](https://developers.google.com/youtube/v3/) plugin for [**apiNG**](https://github.com/JohnnyTheTank/apiNG).

# Information
* **Supported apiNG models: `social`, `video`**
* This plugin supports the [`get-native-data` parameter](https://aping.readme.io/docs/advanced#parameters)
* This plugin needs an [api key](#2-api-key) :warning:
* Used promise library: [angular-youtube-api-factory](https://github.com/JohnnyTheTank/angular-youtube-api-factory) _(included in distribution files)_

# Documentation

1. [INSTALLATION](#1-installation)
    1. Get file
    2. Include file
    3. Add dependency
    4. Add plugin
2. [API KEY](#2-api-key)
    1. Generate your `apiKey`
    2. Insert your `apiKey` into `aping-config.js`
3. [USAGE](#3-usage)
    1. Models
    2. Requests
    3. Rate limit

## 1. INSTALLATION

### I. Get file
Install via either [bower](http://bower.io/), [npm](https://www.npmjs.com/), CDN (jsDelivr) or downloaded files:

* `bower install apiNG-plugin-youtube --save`
* `npm install aping-plugin-youtube --save`
* use [CDN file](https://www.jsdelivr.com/projects/aping.plugin-youtube)
* download [apiNG-plugin-youtube.zip](https://github.com/JohnnyTheTank/apiNG-plugin-youtube/zipball/master)

### II. Include file
Include `aping-plugin-youtube.min.js` in your apiNG application

```html
<!-- when using bower -->
<script src="bower_components/apiNG-plugin-youtube/dist/aping-plugin-youtube.min.js"></script>

<!-- when using npm -->
<script src="node_modules/aping-plugin-youtube/dist/aping-plugin-youtube.min.js"></script>

<!-- when using cdn file -->
<script src="//cdn.jsdelivr.net/aping.plugin-youtube/latest/aping-plugin-youtube.min.js"></script>

<!-- when using downloaded files -->
<script src="aping-plugin-youtube.min.js"></script>
```

### III. Add dependency
Add the module `jtt_aping_youtube` as a dependency to your app module:
```js
var app = angular.module('app', ['jtt_aping', 'jtt_aping_youtube']);
```

### IV. Add the plugin
Add the plugin's directive `aping-youtube="[]"` to your apiNG directive and [configure your requests](#ii-requests)
```html
<aping
    template-url="templates/social.html"
    model="social"
    items="20"
    aping-youtube="[{'search':'funny cats'}]">
</aping>
```

## 2. API KEY

### I. Generate your `apiKey`
1. Login on [console.developers.google.com](https://console.developers.google.com/)
2. Select a project, or create a new one.
3. In the sidebar on the left, expand APIs & auth.
    - Click APIs
        - In the list of APIs, make sure the status is **ON for the YouTube Data API v3**
    - Click Credentials
        - Click New credentials
        - Choose API key
        - Choose Browser key
        - Name and create your API Key

### II. Insert your `apiKey` into `aping-config.js`
Open `js/apiNG/aping-config.js` in your application folder. It should be look like this snippet:
```js
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
```

:warning: Replace `<YOUR_YOUTUBE_API_KEY>` with your youtube `apiKey`

## 3. USAGE

### I. Models
Supported apiNG models

|  model   | content | support | max items<br>per request | (native) default items<br>per request |
|----------|---------|---------|--------|---------|
| `social` | **videos** | full    | `50`   | `5`   |
| `video`  | **videos** | full    | `50`   | `5`   |

**support:**
* full: _the source platform provides a full list with usable results_ <br>
* partly: _the source platfrom provides just partly usable results_


### II. Requests
Every **apiNG plugin** expects an array of **requests** as html attribute.

#### Requests by Channel
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`channelId`** | `UCtQMmwBJGvINGU0lZ_GrZKQ` |  | The `channelId` parameter indicates that the API response should only contain resources created by the channel<br>Username to ChannelId Converter: http://kid.yt.j.pfweb.eu/ | no |
| **`items`**  | `20` | `5` | Items per request (`0`-`50`) |  yes  |
| **`search`** | `happy` |  | The `search` parameter specifies the query term to search for. Your request can also use the Boolean NOT (-) and OR (&#124;) operators to exclude videos or to find videos that are associated with one of several search terms. For example, to search for videos matching either "boating" or "sailing", set the `search` parameter value to boating&#124;sailing. Similarly, to search for videos matching either "boating" or "sailing" but not "fishing", set the `search` parameter value to boating&#124;sailing -fishing | yes |

Sample requests:
* `[{'channelId':'UCtQMmwBJGvINGU0lZ_GrZKQ'}, {'channelId':'UC2pmfLm7iq6Ov1UwYrWYkZA'}]`
* `[{'channelId':'UC37PFGlxWgx4tU6SlhPCdCw', 'items':10, 'search':'prank'}]`

#### Requests by Playlist
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`playlistId`** | `PLykXdRRd47IX_5gUChdhDjgKmQyZtRrC_` |  | The `playlistId` parameter indicates that the API response should only contain resources containing in the playlist | no |
| **`items`**  | `20` | `5` | Items per request (`0`-`50`) |  yes  |

Sample requests:
* `[{'playlistId':'PLXkE1kzapj4a9oWMggQ0i682chTam-I98'}, {'playlistId':'PL0XHkAy96suU3u6rx8S-NBEaHBgqsHTck'}]`
* `[{'channelId':'PL2uZhEhKQPWZ0pI-LUzjDD3OLSuNo3E1p', 'items':10}]`

#### Requests by Search
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`search`** | `music` |  | The `search` parameter specifies the query term to search for. Your request can also use the Boolean NOT (-) and OR (&#124;) operators to exclude videos or to find videos that are associated with one of several search terms. For example, to search for videos matching either "boating" or "sailing", set the `search` parameter value to boating&#124;sailing. Similarly, to search for videos matching either "boating" or "sailing" but not "fishing", set the `search` parameter value to boating&#124;sailing -fishing | no |
| **`items`**  | `20` | `5` | Items per request (`0`-`50`) |  yes  |
| **`lat`** | `-13.163333` |  | Defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. | yes |
| **`lng`** | `-72.545556` |  | Defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. | yes |
| **`distance`** | `1km` | `5000m` | The parameter value must be a floating point number followed by a measurement unit. Valid measurement units are `m`, `km`, `ft`, and `mi`. (valid values: `1500m`, `5km`, `10000ft`, and `0.75mi`) The API does not support values larger than 1000 kilometers. | yes |

Sample requests:
* `[{'search':'eagles'}, {'search':'Thomas Müller'}, {'search':'prank'}]`
* `[{'search':'machu picchu', 'lat':'-13.163333', 'lng':'-72.545556', 'distance':'5km'}]`

#### Requests by Coordinates
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`lat`** | `-13.163333` |  | Defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. | no |
| **`lng`** | `-72.545556` |  | Defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. | no |
| **`distance`** | `1km` | `5000m` | The parameter value must be a floating point number followed by a measurement unit. Valid measurement units are `m`, `km`, `ft`, and `mi`. (valid values: `1500m`, `5km`, `10000ft`, and `0.75mi`) The API does not support values larger than 1000 kilometers. | yes |
| **`items`**  | `20` | `5` | Items per request (`0`-`50`) |  yes  |

Sample requests:
* `[{'lat':'-13.163333', 'lng':'-72.545556', 'distance':'5km'}]`

### III. Rate limit

Visit the official Youtube Data API documentations: [Quota usage](https://developers.google.com/youtube/v3/getting-started#quota)

# Licence
MIT

