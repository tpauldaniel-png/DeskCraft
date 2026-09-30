from io import BytesIO

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool


class CloudinaryStorage:
    def __init__(self, cloud_name: str, api_key: str, api_secret: str) -> None:
        cloudinary.config(
            cloud_name=cloud_name, api_key=api_key, api_secret=api_secret, secure=True
        )

    async def upload_file(self, image: UploadFile) -> dict:

        file_content = await image.read()

        file_stream = BytesIO(file_content)
        file_stream.name = image.filename or "image.jpg"

        result = await run_in_threadpool(
            cloudinary.uploader.upload, file_stream, resource_type="image"
        )

        return {
            "public_id": result["public_id"],
            "secure_url": result["secure_url"],
        }
