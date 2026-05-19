import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const ProgressIndicator = () => {
  const progressRef = useRef(null);

  useEffect(() => {
    const progress = progressRef.current;

    const trigger = ScrollTrigger.create({
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(progress, {
          scaleX: self.progress,
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div className="progress">
      <div ref={progressRef} className="progress-bar" />
    </div>
  );
};

export default ProgressIndicator;
