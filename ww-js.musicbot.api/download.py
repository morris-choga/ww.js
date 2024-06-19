import asyncio
import time
import os
from downloaded_albums import album_ids
from pytube import YouTube
from pytube.exceptions import AgeRestrictedError
from ytmusicapi import YTMusic
from pytube.cli import on_progress
from songmetadata import tagger, get_playlist, get_songs_metadata
from downloaded_albums import album_ids
# from moviepy.editor import *
os.environ["FFMPEG_BINARY"] = "/usr/bin/ffmpeg"
from moviepy.editor import AudioFileClip

oauth = f"{os.getcwd()}/auth.json"
from pytube import Playlist
import shutil

# yt = YTMusic(oauth,proxies={"http":"http://209.58.171.215","http":"http://154.16.146.44"})
yt = YTMusic(oauth)
import os



# from pytubefix.exceptions import PytubeError


def download_song(video_id, location):
    audio_link = f'https://music.youtube.com/watch?v={video_id}'

    try:

        yt = YouTube(audio_link)
        print(yt)

        if yt.length <= 900:
            #         if yt.length <= 900000000:
            yt.title = "".join([c for c in yt.title if c not in ['/', '\\', '|', '?', '*', ':', '>', '<', '"']])
            video = yt.streams.filter(only_audio=True).first()
            vid_file = video.download(output_path=location)
            base = os.path.splitext(vid_file)[0]
            audio_file = base + ".mp3"
        else:
            return {"Error": "oops! song is too long"}, 501




    except AgeRestrictedError as e:

        print(f"Error has occurred with pytube because of age restriction:{type(e).__name__} {str(e)}")
        return {"Error": "oops! This song seems to be unavailable"}, 502

    except (Exception, SystemExit) as e:

        print(f"Error has occurred with pytube: {type(e).__name__} {str(e)}")

        return f"Error has occurred with pytube: {str(e)}"

    try:

        mp4_no_frame = AudioFileClip(vid_file)
        mp4_no_frame.write_audiofile(audio_file, logger=None)
        mp4_no_frame.close()
        os.remove(vid_file)
        os.replace(audio_file, location + "/" + yt.title + ".mp3")
        audio_file = location + "/" + yt.title + ".mp3"
        return audio_file

    except (SystemExit, KeyboardInterrupt):
        # Re-raise these exceptions to allow the application to exit or be interrupted
        #
        print("System exit was caught")

    except Exception as e:
        print(f"Error has occurred: {type(e).__name__} {str(e)}")
        return f"Error has occurred: {str(e)}"


def download_video(video_id, location):



    try:

        yt = YouTube(f"https://youtube.com/watch?v={video_id}")
        if yt.length <= 900:
            #         if yt.length <= 900000000:
            yt.title = "".join([c for c in yt.title if c not in ['/', '\\', '|', '?', '*', ':', '>', '<', '"']])


            video = yt.streams.filter(res="720p").first()
            vid_file = video.download(output_path=location)

            return vid_file

        else:
            return {"Error": "oops! song is too long"}, 501




    except AgeRestrictedError as e:

        print(f"Error has occurred with pytube:{type(e).__name__} {str(e)}")
        return {"Error": "oops! This song seems to be unavailable"}, 502

    except (Exception, SystemExit) as e:

        print(f"Error has occurred with pytube: {type(e).__name__} {str(e)}")
        return f"Error has occurred with pytube: {str(e)}"

    return ""


def download_album(album_id, location):
    album_link = f"https://music.youtube.com/playlist?list="

    album_metadata = yt.get_album(album_id)
    album_name = album_metadata["title"]
    album_songs = Playlist(album_link + album_metadata["audioPlaylistId"])
    print(len(album_songs))

    try:
        os.makedirs(location + "/" + album_name)

    except FileExistsError as e:
        print("Album folder already exists, deleting...")
        shutil.rmtree(location + "/" + album_name)
        os.makedirs(location + "/" + album_name)

    for song in album_songs.videos:

        try:
            song_path = download_song(song.video_id, location + "/" + album_name)
            tagger(song_path, song.video_id, album_id)
        except Exception as e:
            print(f"Error has occurred while downloading or tagging: {str(e)}")

    archived = shutil.make_archive(location + "/" + album_name, 'zip', location + "/" + album_name)
    shutil.rmtree(location + "/" + album_name)

    album_ids[album_id] = album_name



    return archived


def download_playlist(url):
    track_num = 1
    playlist = get_playlist(url)
    location = "/usr/src/api/morris/songs/"
    # playlist_name = playlist["playlist"]
    playlist_name = "".join(
        [c for c in playlist["playlist"] if c not in ['/', '\\', '|', '?', '*', ':', '>', '<', '"']])

    try:
        os.makedirs(location + playlist_name)

        # os.makedirs("/usr/src/api/morris/songs/testing")

    except FileExistsError as e:
        print("Album folder already exists, deleting...")
        shutil.rmtree(location + playlist_name)
        os.makedirs(location + playlist_name)

    for title, artist in playlist.items():
        song_metadata = get_songs_metadata(f"{artist} {title}")
        print(title)

        if len(song_metadata) > 0:
            song = download_song(song_metadata[0]["video_id"], location + playlist_name)
            # song = download_song(song_metadata[0]["video_id"], "/usr/src/api/morris/songs/testing")
            tagger(song, song_metadata[0]["video_id"], song_metadata[0]["album_id"], track_num=track_num)
            track_num += 1
            time.sleep(10)
        else:
            print(f"{title} returned no results")
