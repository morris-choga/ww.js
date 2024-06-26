import asyncio
from threading import Thread
from downloaded_albums import album_ids
from songmetadata import get_song_metadata, get_songs_metadata, get_albums_metadata,lyrics, tagger, get_videos_metadata
from download import download_song,download_album,download_playlist,download_video

import os
from flask import Flask

from flask import request,jsonify


app = Flask(__name__)



@app.route("/searchsong", methods=['GET', 'POST'])
def search_song():
    requested_song = request.get_json()
    songs_metadata = get_songs_metadata(f"{requested_song['key']}")

    return songs_metadata

@app.route("/searchalbums", methods=['GET', 'POST'])
def search_album():
    requested_album = request.get_json()
    albums_metadata = get_albums_metadata(f"{requested_album['key']}")
    return  albums_metadata

@app.route('/searchvideos', methods=['GET', 'POST'])
def search_video():
    requested_video = request.get_json()

    videos_metadata = get_videos_metadata(f"{requested_video['key']}")


    return videos_metadata



@app.route("/getsong", methods=['GET', 'POST'])
def get_song():
    requested_song = request.get_json()
    video_id = requested_song['video_id']



    song = download_song(video_id, os.path.join("/usr/src/api/media", "songs"))
#     song = download_song(video_id, os.path.join("/remotefiles/ww.js", "songs"))

    if "album_id" in requested_song:
        tagger(song,video_id,requested_song["album_id"])

    else: tagger(song,video_id)
    return song

@app.route("/getvideo", methods=['GET', 'POST'])
def get_video():
    requested_video = request.get_json()


    video_id = requested_video['video_id']

    video = download_video(video_id, os.path.join("/usr/src/api/media", "videos"))
#     video = download_video(video_id, os.path.join("/usr/src/app/media", "videos"))

    return video







    song = download_song(video_id, os.path.join("/usr/src/api/media", "songs"))
#     song = download_song(video_id, os.path.join("/remotefiles/ww.js", "songs"))

    if "album_id" in requested_video:
        tagger(song,video_id,requested_video["album_id"])

    else: tagger(song,video_id)
    return song

@app.route("/getalbum", methods=['GET', 'POST'])
def get_album():
    requested_album = request.get_json()

    album_id = requested_album['album_id']
    # album = download_album(album_id,os.path.join("/usr/src/api/media", "albums"))

    thread = Thread(target=download_album, args=(album_id,os.path.join("/usr/src/api/media", "albums")))
    thread.start()


    # return album
    return "Done"


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
@app.route('/playlist', methods=['GET', 'POST'])
def get_playlist():
    requested_playlist = request.get_json()
    playlist_url = requested_playlist['playlist']



    download_playlist(playlist_url)
    return "Playlist downloading finished"

@app.route('/get_status', methods=['GET'])
def get_status():
    return {'status': 200}, 200

@app.route('/get_album_status', methods=['GET', 'POST'])
def get():
    requested_album = request.get_json()
    album_id = requested_album['album_id']



    # location = "/usr/src/api/media/albums/a.zip"
    if album_id in album_ids:
        x = album_ids[album_id]
        album_ids.pop(album_id)

        return {'status': 200,"location":x}, 200
    return {'status': 404}, 404





if __name__ =="__main__":
    # app.run(debug=True,use_reloader=False)
    # app.run(debug=True,use_reloader=False,host='0.0.0.0')
    app.run(debug=True,use_reloader=True,host='0.0.0.0')
