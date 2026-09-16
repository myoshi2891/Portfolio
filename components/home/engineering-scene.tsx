"use client";

import { useState } from "react";

export function EngineeringScene() {
  const [iteration, setIteration] = useState(0);
  return <div className="engineering-visual">
    <div className="scene-topline"><span>FROM LEARNING TO BUILDING</span><span aria-hidden="true">↗</span></div>
    <div className="engineering-scene" key={iteration} aria-hidden="true">
      <div className="scene-orbit orbit-one" /><div className="scene-orbit orbit-two" />
      <div className="layer-stack">
        <div className="system-layer layer-base"><span className="layer-label">03 / DATA</span><div className="data-nodes"><i /><i /><i /></div><span className="layer-caption">Structure & persist</span></div>
        <div className="system-layer layer-middle"><span className="layer-label">02 / LOGIC</span><div className="logic-lines"><i /><i /><i /></div><span className="layer-caption">Connect the pieces</span></div>
        <div className="system-layer layer-top"><span className="layer-label">01 / INTERFACE</span><span className="scene-code">&lt;/&gt;</span><div className="interface-lines"><i /><i /></div></div>
      </div>
      <span className="scene-tag tag-build">Build with purpose.</span><span className="scene-tag tag-learn">学びを積み重ねる</span>
    </div>
    <div className="scene-bottomline"><span><span className="blue-dot" />小さな学びから、動く仕組みへ。</span><button type="button" onClick={() => setIteration(n => n + 1)} aria-label="立体アニメーションを再生">↻ <span>Replay</span></button></div>
  </div>;
}
