import json
import os
import time

t = time.time()


BACKGROUND = "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=15:15,drawbox=x=0:y=0:w=1920:h=1080:color=black@0.25:t=fill[bg];"
VISUALIZATION = "[1:a]avectorscope=s=1920x1080:r=60:draw=line[vi];"
VIDEO = "[bg][vi]overlay=W-w:H-h,drawtext=fontfile=font.ttf:fontcolor=white:fontsize=64:x=30:y=30:text='{text}'[video_out]"


def ffmpeg(data):
    id = data["id"]
    cover = data["thumbnail"]
    source = data["filename"]

    text = f"{data['title']} - {' & '.join(data['artists'])}".replace(":", "\:")
    video = VIDEO.format(text=text)

    filter = f"{BACKGROUND}{VISUALIZATION}{video}"

    return f'ffmpeg -hwaccel cuda -i {cover} -i sources/{source} -filter_complex "{filter}" -map "[video_out]" -map 1:a -af "apad=pad_dur=1" -r 60 -c:v h264_nvenc -preset p7 -cq 18 sources/{id}.mp4 -y'


with open("sources/playlist.json", "r", encoding="utf8") as file:
    ids = json.load(file)

for id in ids:
    with open(f"sources/{id}.json", "r", encoding="utf8") as file:
        data = json.load(file)

    os.system(ffmpeg(data))

with open(f"sources/playlist.txt", "w", encoding="utf8") as file:
    files = []

    for id in ids:
        files.append(f"file '{id}.mp4'")

    file.write("\n".join(files))

os.system("ffmpeg -f concat -safe 0 -i sources/playlist.txt -c copy playlist.mp4 -y")


print("Done in", time.time() - t, "seconds")
