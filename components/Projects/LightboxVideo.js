import { useEffect, useRef } from "react";

const LightboxVideo = ({ isActive, ...videoProps }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!isActive) {
      video.pause();
      return undefined;
    }

    const resumePlayback = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resumePlayback();
      return undefined;
    }

    video.addEventListener("canplay", resumePlayback, { once: true });
    return () => video.removeEventListener("canplay", resumePlayback);
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      {...videoProps}
      autoPlay={isActive}
      preload="metadata"
    />
  );
};

export default LightboxVideo;
