"""Generate branded ManaLife Calendar assets via Gemini Nano Banana."""
import asyncio
import base64
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

sys.path.insert(0, "/app/backend")
load_dotenv("/app/backend/.env")

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402

OUT = Path("/app/frontend/assets/images")
MODEL = "gemini-3.1-flash-image-preview"
KEY = os.getenv("EMERGENT_LLM_KEY")

ASSETS = [
    {
        "name": "icon_source",
        "file": "icon-source.png",
        "prompt": (
            "A luxurious mobile app icon for a premium Hindu / Telugu Panchang calendar app "
            "called 'ManaLife Calendar'. Rounded square icon composition. Deep navy blue "
            "background (#0A1128 to #060B19 subtle vertical gradient). Centered emblem: an "
            "ornate antique gold (#D4AF37) sun mandala combined with a stylized crescent moon "
            "and a small lotus at the base — symbolizing Panchang (sun & moon). Fine gold "
            "filigree line work, elegant and sacred, NOT cartoonish. Symmetrical. No text, no "
            "letters, no words. Clean edges, high-contrast, print-quality. Solid opaque "
            "background, edge to edge (no transparency, no white border). Square 1:1 aspect."
        ),
    },
    {
        "name": "adaptive_foreground",
        "file": "adaptive-icon-source.png",
        "prompt": (
            "Foreground layer for an Android adaptive icon of a Telugu Panchang app called "
            "'ManaLife Calendar'. Centered ornate antique gold (#D4AF37) emblem combining a "
            "sun mandala, crescent moon, and small lotus base. Fine gold filigree, symmetrical. "
            "The emblem MUST fit inside the CENTRAL 66% safe-zone of the canvas — leave "
            "generous empty transparent-looking margin around it. Solid dark navy background "
            "(#0A1128 flat, no gradient). No text, no letters. Square 1:1 aspect."
        ),
    },
    {
        "name": "splash",
        "file": "splash-source.png",
        "prompt": (
            "A premium mobile app splash screen for 'ManaLife Calendar' — a Telugu Hindu "
            "Panchang app. Deep cinematic navy blue background (#060B19), subtle golden "
            "particles / soft radial glow behind the centered emblem. The emblem is an ornate "
            "antique gold (#D4AF37) sun mandala with crescent moon and lotus base — sacred, "
            "elegant, symmetrical. Empty space around emblem for text overlay. No text, no "
            "words, no letters in the image. Portrait 9:16 aspect."
        ),
    },
    {
        "name": "feature_graphic",
        "file": "feature-graphic-source.png",
        "prompt": (
            "A premium Google Play Store feature graphic (banner) for a Telugu Hindu Panchang "
            "app called 'ManaLife Calendar'. Deep cinematic navy blue background (#060B19) "
            "with subtle golden bokeh and soft rays of light on the left. On the right side, "
            "an ornate antique gold (#D4AF37) sun mandala emblem with crescent moon and lotus. "
            "Elegant fine gold filigree on the edges. Empty negative space on the left for a "
            "title overlay to be added later. No text, no words, no letters in the image. "
            "Wide banner composition, landscape orientation."
        ),
    },
]


async def gen(spec: dict) -> None:
    print(f"[{spec['name']}] requesting...")
    chat = (
        LlmChat(
            api_key=KEY,
            session_id=f"manalife-{spec['name']}",
            system_message="You are an expert product designer generating premium mobile app assets.",
        )
        .with_model("gemini", MODEL)
        .with_params(modalities=["image", "text"])
    )
    msg = UserMessage(text=spec["prompt"])
    _, images = await chat.send_message_multimodal_response(msg)
    if not images:
        print(f"[{spec['name']}] NO IMAGE returned")
        return
    img = images[0]
    out_path = OUT / spec["file"]
    with open(out_path, "wb") as f:
        f.write(base64.b64decode(img["data"]))
    print(f"[{spec['name']}] wrote {out_path} ({out_path.stat().st_size} bytes)")


async def main() -> None:
    for spec in ASSETS:
        try:
            await gen(spec)
        except Exception as e:
            print(f"[{spec['name']}] error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
