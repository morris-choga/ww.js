from ytmusicapi import YTMusic
import os
oauth = f"{os.getcwd()}/oauth.json"
yt = YTMusic(oauth)



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

        return {"title": title, "album_name": album_name, "artist": artist, "year": year, "video_id": video_id,
                "url": url}

    except Exception  as e:
        print(f"An error occurred: {e}")
        return None




def lyrics(song):
    try:
        results = yt.search(song, filter="songs")

        album = yt.get_album(results[0]["album"]["id"])
        album_art = album['thumbnails'][-1]['url']




        video_id = results[0]['videoId']
        data = yt.get_watch_playlist(video_id)
        lyrics_id = data["lyrics"]

        lyrics = yt.get_lyrics(lyrics_id)
        return {"album_art":album_art, "lyrics":lyrics["lyrics"]}

    except Exception as e:
        print(f"An error occurred: {e}")
        return None
