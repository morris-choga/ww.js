
from pytube import YouTube
from pytube.cli import on_progress
from moviepy.editor import *
import os

# from pytubefix.exceptions import PytubeError



def download(video_id,location):
    link = f'https://music.youtube.com/watch?v={video_id}'




    try:

        yt = YouTube(link)
        if yt.length <= 900:
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





