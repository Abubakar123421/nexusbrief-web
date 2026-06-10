# NexusBrief — Hero Video

Place your generated hero video here as:

  public/hero-video.mp4

## How to generate
Use the AI video prompt from `nexusbrief_system_spec.md` with:
- Sora, Runway Gen-3, Kling AI, or Pika Labs
- Export at 1920x1080 (H.264, no audio)
- Compress: `ffmpeg -i input.mp4 -vcodec h264 -crf 28 -an hero-video.mp4`
- Keep under 15MB

## Fallback
Until the video is added, the hero section shows a solid dark background.
The scroll-seek feature will activate automatically once `hero-video.mp4` is present.
