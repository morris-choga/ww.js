import requests

url = 'http://getsong-api.onrender.com:80'
headers = {
    'Content-Type': 'application/json',

}

body = {
    'video_id': '',

}


def download_song(video_id):

    body["video_id"] = video_id

    try:
        response = requests.post(url, headers=headers, json=body)
        return response.text


    except requests.exceptions.RequestException as e:
        print(f"Error making API call: {e}")
        return f"Error making API call: {e}"

