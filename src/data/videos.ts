/**
 * @deprecated Use `src/data/releases.ts` — each unit is short + podcast + blog.
 * Re-exports kept so older imports keep working.
 */
export {
  releases as channelVideos,
  type Release as ChannelVideo,
  youtubeWatchUrl,
  youtubeVideoId,
  youtubeThumb,
  releaseThumb as youtubeThumbFromRelease,
} from "@/data/releases";
