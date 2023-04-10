import json
import os

from yt_dlp import YoutubeDL
from ytmusicapi import YTMusic

PLAYLIST = "PLrOLWE2_egoPwbmDQRmaWEsYUK4Vk69t6"

if not os.path.exists("sources"):
    os.mkdir("sources")

ytmusic = YTMusic("headers_auth.json")
ytdl = YoutubeDL(
    {
        "format": "bestaudio",
        "outtmpl": f"sources/%(id)s.%(ext)s",
        "quiet": True,
        "cookiefile": "cookies.txt",
    }
)

playlist = ytmusic.get_playlist(PLAYLIST)
ids = []

for track in playlist["tracks"]:
    ids.append(track["videoId"])

    data = {
        "filename": None,
        "id": track["videoId"],
        "title": track["title"],
        "artists": [artist["name"] for artist in track["artists"]],
        "album": track["album"]["name"],
        "thumbnail": track["thumbnails"][-1]["url"].split("=")[0],
    }

    ytdl.download([f"https://www.youtube.com/watch?v={data['id']}"])

    for file in os.listdir("sources"):
        if file.startswith(data["id"]):
            data["filename"] = file
            break

    with open(f"sources/{data['id']}.json", "w", encoding="utf8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

    with open(f"sources/playlist.json", "w", encoding="utf8") as file:
        json.dump(ids, file, ensure_ascii=False, indent=2)
