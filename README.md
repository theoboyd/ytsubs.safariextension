# ytsubs

Displays YouTube commenters' subscriber counts next to their names.
Waits for comments to load before fetching this data.

Uses the YouTube API twice at most per comment. Runs on comments loaded on the
initial video load by YouTube (i.e.: first set of top-level comments, plus some
main reply comments), so fits easily within the free daily quota usage.

Requires a YouTube API key to be provided in a separate file (not included) in
the same directory with filename `apikey`.

To run, enable the Developer menu in Safari and open the extension builder from
there, adding it manually. Requires an Apple Developer Account certificate
to install permanently.
