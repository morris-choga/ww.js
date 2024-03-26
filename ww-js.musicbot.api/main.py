from songmetadata import get_song_metadata, lyrics
from download_song import tagger,download
from downloadsong_api import download_song
from flask import request, jsonify
import os
from flask import Flask

app = Flask(__name__)


@app.route("/getsong", methods=['GET', 'POST'])
def get_song():
    requested_song = request.get_json()
    song_metadata = get_song_metadata(f"{requested_song['key']}")

    if song_metadata is None:
        return {}
    else:
        song = download(song_metadata["title"], song_metadata["video_id"], os.path.join("/usr/src/api", "songs"))
        tagger(song_metadata["title"], song_metadata["artist"], song_metadata["album_name"], song_metadata["url"], song)
        return song


@app.route("/getsonginfo", methods=['GET', 'POST'])
def get_song_info():
    requested_song = request.get_json()
    song_metadata = get_song_metadata(f"{requested_song['key']}")

    if song_metadata is None:
        return {}
    else:

        return {
            "title":song_metadata["title"],
            "artist":song_metadata["artist"],
            "album":song_metadata["album_name"],
            "year":song_metadata["year"],
            "album_art":song_metadata["url"],
                }



@app.route('/lyrics', methods=['GET', 'POST'])
def get_lyrics():
    requested_song = request.get_json()
    result = lyrics(f"{requested_song['key']}")


    if result is None:
        return {}
    else:
        return result


@app.route('/get_status', methods=['GET'])
def get_status():
    return {'status': 200}, 200

if __name__ =="__main__":
    # app.run(debug=True,use_reloader=False)
    # app.run(debug=True,use_reloader=False,host='0.0.0.0')
    app.run(debug=True,use_reloader=True,host='0.0.0.0')
