// import React from "react";

export default function BoundingBox({ box, label }: { box: number[]; label: string }) {
  // box = [ymin, xmin, ymax, xmax] in normalized coords
  const style = {
    position: "absolute" as const,
    top: `${box[0] * 100}%`,
    left: `${box[1] * 100}%`,
    width: `${(box[3] - box[1]) * 100}%`,
    height: `${(box[2] - box[0]) * 100}%`,
    border: "2px solid red",
    pointerEvents: "none" as const,
  };
  return (
    <>
      <div style={style} />
      <div style={{ ...style, background: "rgba(255,0,0,0.2)", fontSize: 12 }}>
        {label}
      </div>
    </>
  );
}
