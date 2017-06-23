/*jslint browser:true */

var ytAPIv3 = "https://www.googleapis.com/youtube/v3/channels";
var apiKey = -1;

function httpGetAndSetSubCount(authorUrl, targetDiv) {

    // Load YouTube API key from external file
    $.get(safari.extension.baseURI + "apikey", function(apiKeyData) {
        apiKey = apiKeyData;

        // Convert YouTube comment author URL to a channel ID
        var channelIdRegex = /^\/channel\/(.*)/;
        var channelIdMatches = channelIdRegex.exec(authorUrl);

        var userNameRegex = /^\/user\/(.*)/;
        var userNameMatches = userNameRegex.exec(authorUrl);

        if (channelIdMatches !== null) {
            setSubCount(channelIdMatches[1], targetDiv);
        }
        else if (userNameMatches !== null) {
            var userName = userNameMatches[1];
            $.getJSON(ytAPIv3 + "?key=" + apiKey + "&forUsername=" + userName +
                "&part=id", function(userIdData){

                setSubCount(userIdData.items[0].id, targetDiv);
            });
        }
    });
}

function setSubCount(userId, targetDiv) {
    // Get subscriber count from API
    $.getJSON(ytAPIv3 + "?part=statistics" + "&id=" + userId + "&key=" +apiKey,
        function(channelData) {

        var subCount = channelData.items[0].statistics.subscriberCount;

        var newElement = document.createElement("span");
        newElement.textContent = subCount + " subs ";
        newElement.style.color = "#128ee9";
        targetDiv.prepend(newElement);
    });
}

// Callback executed when node was found
function handleNode(node) {
    var headers = $(node).find(".comment-renderer-header");

    Array.prototype.forEach.call(headers, function(header) {
        var authorUrl = $(header).find(".comment-author-text").eq(0);
        var insertionSpan = $(header).find(".comment-renderer-time > .yt-uix-sessionlink").eq(0);
        httpGetAndSetSubCount(authorUrl.attr("href"), insertionSpan);
    });
}

// Set up the mutation observer
var observer = new MutationObserver(function (mutations, me) {
    // `mutations` is an array of mutations that occurred
    // `me` is the MutationObserver instance

    // Warning! XXX: Cannot use jQuery selector here:
    var node = document.getElementById("comment-section-renderer-items");
    if (node) {
        handleNode(node);
        me.disconnect(); // Stop observing
        return;
    }
});

// Start observing
observer.observe(document, {
    childList: true,
    subtree: true
});
