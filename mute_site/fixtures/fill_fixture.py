import json
import os
from pathlib import Path

def fill():
    file = "objects.json"
    jObject = None
    with open(file, 'r') as f:
        jObject = json.load(f)


    media_image_path = os.path.join(Path(os.getcwd()).parent, "media", "image")

    image_dirs = [d for d in os.listdir(media_image_path) if os.path.isdir(os.path.join(media_image_path, d))]

    for obj in jObject:
        video_name = obj["fields"]["video"].split('/')[2].split(".")[0]
        for d in image_dirs:
            if d == "userAvatarIcons": continue
            image_files = [f for f in os.listdir(os.path.join(media_image_path, d))]
            for image in image_files:
                if image.split(".")[0].lower() == video_name.lower():
                    obj["fields"]["image"] = f"image/{d}/{image}"

    for obj in jObject:
        print(json.dumps(obj))

    with open("test.json", 'w') as f:
        json.dump(jObject, f, ensure_ascii=False)


if __name__ == '__main__':
    fill()