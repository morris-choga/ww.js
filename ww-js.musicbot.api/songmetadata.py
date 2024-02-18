from ytmusicapi import YTMusic
import os
header = f"{os.getcwd()}/header.json"
yt = YTMusic(header)



def get_song_metadata(song):

    try:
        results = yt.search(song, filter="songs")
        title = results[0]['title']
        album_name = results[0]['album']['name']
        artist = results[0]['artists'][0]['name']

        video_id = results[0]['videoId']
        album = yt.get_album(results[0]["album"]["id"])
        year = album["year"]
        url = album['thumbnails'][-1]['url']

    except Exception  as e:
        print(f"An error occurred: {e}")

    return {"title":title, "album_name":album_name, "artist":artist,"year":year,"video_id":video_id, "url":url}



