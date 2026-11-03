import asyncio
import selectors
import sys

import uvicorn


def create_event_loop() -> asyncio.AbstractEventLoop:
    if sys.platform == "win32":
        # Use SelectorEventLoop on Windows to avoid issues with ProactorEventLoop
        loop = asyncio.SelectorEventLoop(selectors.SelectSelector())
    else:
        # Use the default event loop on other platforms
        loop = asyncio.new_event_loop()

    asyncio.set_event_loop(loop)

    return loop


if __name__ == "__main__":
    config = uvicorn.Config(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
    )
    server = uvicorn.Server(config)

    asyncio.run(
        server.serve(),
        loop_factory=create_event_loop,
    )
