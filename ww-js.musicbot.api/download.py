
from pytube import YouTube
from ytmusicapi import YTMusic
from pytube.cli import on_progress
from songmetadata import tagger
from moviepy.editor import *
oauth = f"{os.getcwd()}/oauth.json"
from pytube import Playlist
import shutil
yt = YTMusic(oauth)
import os

# from pytubefix.exceptions import PytubeError



def download_song(video_id, location):
    audio_link = f'https://music.youtube.com/watch?v={video_id}'





    try:

        yt = YouTube(audio_link)
        if yt.length <= 900:
#         if yt.length <= 900000000:
            yt.title = "".join([c for c in yt.title if c not in ['/', '\\', '|', '?', '*', ':', '>', '<', '"']])
            video = yt.streams.filter(only_audio=True).first()
            vid_file = video.download(output_path=location)
            base = os.path.splitext(vid_file)[0]
            audio_file = base + ".mp3"
        else:
            return {"Error": "oops! song is too long"},501


    # except PytubeError as e:
    #     print(f"An error occured with PytubeError: " + str(e))
    #     return f"An error occured with PytubeError: " + str(e)

    except Exception as e:
        print(f"Error has occured with pytube: {str(e)}")
        return f"Error has occured with pytube: {str(e)}"


    try:

        mp4_no_frame = AudioFileClip(vid_file)
        mp4_no_frame.write_audiofile(audio_file, logger=None)
        mp4_no_frame.close()
        os.remove(vid_file)
        os.replace(audio_file, location + "/" + yt.title + ".mp3")
        audio_file = location + "/" + yt.title + ".mp3"
        return audio_file




    except Exception as e:
        print(f"Error has occured: {str(e)}")
        return f"Error has occured: {str(e)}"

def download_video(video_id, location):
    pass

def download_album(album_id,location):


    album_link = f"https://music.youtube.com/playlist?list="



    album_metadata = yt.get_album(album_id)
    album_name = album_metadata["title"]
    album_songs = Playlist(album_link+album_metadata["audioPlaylistId"])
    print(len(album_songs))

    try:
        os.makedirs(location+"/"+album_name)

    except FileExistsError as e:
        print("Album folder already exists, deleting...")
        shutil.rmtree(location+"/"+ album_name)
        os.makedirs(location + "/"+ album_name)


    for song in album_songs.videos:

        try:
                song_path = download_song(song.video_id,location+"/"+ album_name)
                tagger(song_path, song.video_id, album_id)
        except Exception as e:
            print(f"Error has occured while downloading or tagging: {str(e)}")


    archived = shutil.make_archive(location+ "/" +album_name, 'zip', location+"/"+ album_name)
    shutil.rmtree(location + "/" + album_name)

    return archived

