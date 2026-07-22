import { useEffect, useRef, useState } from "react";

const IconFullscreen = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
  </svg>
);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ControlledVideo({
  src,
  label,
  className = "",
  priority = false,
  isActive = true,
  detailMode = false,
  showSeek = true,
  onSurfaceClick,
}) {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMonochrome, setIsMonochrome] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isActive || reduceMotion) {
      video.pause();
      setIsPaused(true);
      return undefined;
    }

    video.play().then(() => setIsPaused(false)).catch(() => setIsPaused(true));
    return undefined;
  }, [isActive, src]);

  useEffect(() => {
    const refreshCursor = () => window.dispatchEvent(new CustomEvent("portfolio:cursor-refresh"));
    document.addEventListener("fullscreenchange", refreshCursor);
    document.addEventListener("webkitfullscreenchange", refreshCursor);
    return () => {
      document.removeEventListener("fullscreenchange", refreshCursor);
      document.removeEventListener("webkitfullscreenchange", refreshCursor);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("portfolio:cursor-refresh"));
  }, [controlsVisible]);

  const stopControlEvent = (event) => event.stopPropagation();

  const togglePlayback = (event) => {
    stopControlEvent(event);
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPaused(false)).catch(() => setIsPaused(true));
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const openFullscreen = (event) => {
    stopControlEvent(event);
    const video = videoRef.current;
    if (!video) return;

    window.dispatchEvent(new CustomEvent("portfolio:cursor-clear"));
    const request = video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen;
    if (request) {
      Promise.resolve(request.call(video)).catch(() => {});
      return;
    }

    video.webkitEnterFullscreen?.();
  };

  const seekTo = (event) => {
    stopControlEvent(event);
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const next = clamp(Number(event.currentTarget.value), 0, 100);
    video.currentTime = (next / 100) * video.duration;
    setProgress(next);
  };

  const handleSurfaceClick = (event) => {
    if (!detailMode) return;
    event.stopPropagation();
    setControlsVisible((visible) => !visible);
    onSurfaceClick?.();
  };

  return (
    <div
      className={`controlled-video ${detailMode ? "is-detail" : "is-collapsed"} ${isMonochrome ? "is-monochrome" : "is-color"} ${controlsVisible ? "has-visible-controls" : "has-hidden-controls"}`}
      onClick={handleSurfaceClick}
    >
      <video
        ref={videoRef}
        src={src}
        className={className}
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={label}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (Number.isFinite(video.duration) && video.duration > 0) {
            setProgress((video.currentTime / video.duration) * 100);
          }
        }}
      />

      {detailMode && (
        <div className="controlled-video-top-controls" data-cursor-group="buttons">
          <button
            type="button"
            className="controlled-video-icon-button is-bw"
            data-clickable="true"
            onClick={(event) => {
              stopControlEvent(event);
              setIsMonochrome((value) => !value);
            }}
            aria-pressed={isMonochrome}
            aria-label={`${isMonochrome ? "Show color" : "Show black and white"} for ${label}`}
          >
            <span className={`project-media-bw-icon ${isMonochrome ? "is-monochrome" : "is-color"}`} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="controlled-video-icon-button is-fullscreen"
            data-clickable="true"
            onClick={openFullscreen}
            aria-label={`Open ${label} fullscreen`}
          >
            <IconFullscreen />
          </button>
        </div>
      )}

      <button
        type="button"
        className="controlled-video-play"
        data-clickable="true"
        onClick={togglePlayback}
        aria-label={`${isPaused ? "Play" : "Pause"} ${label}`}
        aria-pressed={!isPaused}
      >
        <span className={`project-media-playback-icon ${isPaused ? "is-play" : "is-pause"}`} aria-hidden="true" />
      </button>

      {showSeek && (
        <div className="controlled-video-seek-shell" onClick={stopControlEvent} onPointerDown={stopControlEvent}>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            className="controlled-video-seek"
            style={{ "--video-progress": `${progress}%` }}
            data-clickable="true"
            onChange={seekTo}
            onInput={seekTo}
            aria-label={`Seek through ${label}`}
          />
        </div>
      )}
    </div>
  );
}
