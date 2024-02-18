import urllib

from mutagen.id3 import ID3, TIT2, TALB, TPE1, TPE2, COMM, TCOM, TCON, TDRC, TRCK, APIC
from mutagen.easyid3 import EasyID3
from pytube import YouTube
from moviepy.editor import *
import os

from pytube.exceptions import PytubeError


def download(title,video_id,location):
    link = f'https://music.youtube.com/watch?v={video_id}'
    filename = f"{title,}.mp3"

    try:

        yt = YouTube(link)
        yt.title = "".join([c for c in yt.title if c not in ['/', '\\', '|', '?', '*', ':', '>', '<', '"']])
        video = yt.streams.filter(only_audio=True).first()
        vid_file = video.download(output_path=location)
        base = os.path.splitext(vid_file)[0]
        audio_file = base + ".mp3"

        mp4_no_frame = AudioFileClip(vid_file)
        mp4_no_frame.write_audiofile(audio_file, logger=None)
        mp4_no_frame.close()
        os.remove(vid_file)
        os.replace(audio_file, location + "/" + yt.title + ".mp3")
        audio_file = location + "/" + yt.title + ".mp3"
        return audio_file


    except PytubeError as e:
        print(f"An error occured while downloading: " + str(e))

    except Exception as e:
        print(f"Error has occured: {str(e)}")


def tagger(title, artist, album, thumbnail, location):

    try:
        thumbnail = thumbnail
        mp3file = EasyID3(location)
        mp3file["albumartist"] = album
        mp3file["artist"] = artist
        mp3file["album"] = album
        mp3file["title"] = title
        mp3file["website"] = 't.me/mchoga'
        mp3file["tracknumber"] = str(1)
        mp3file.save()

        audio = ID3(location)
        audio.save(v2_version=3)

        audio = ID3(location)
        with urllib.request.urlopen(thumbnail) as albumart:
            audio["APIC"] = APIC(
                encoding=3, mime="image/jpeg", type=3, desc="Cover", data=albumart.read()
            )
        audio.save(v2_version=3)

    except Exception as e:
        print(f"An error occurred: {e}")
