"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const PHOTOS = [
  { src: "/os/mycorner.jpeg", id: "photo", x: 75, y: 55 },
  { src: "/os/bike.jpeg", id: "photo2", x: 82, y: 25 },
  { src: "/os/small-me.jpeg", id: "photo3", x: 68, y: 35 },
  { src: "/os/smallme2.jpeg", id: "photo4", x: 60, y: 60 },
];

interface PhotoWidgetProps {
  onClick: (id: string) => void;
}

function DraggablePhoto({
  src,
  id,
  startX,
  startY,
  rotation,
  onClick,
}: {
  src: string;
  id: string;
  startX: number;
  startY: number;
  rotation: number;
  onClick: () => void;
}) {
  const [pos, setPos] = useState({ x: startX, y: startY });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    moved.current = false;
    offset.current = {
      x: e.clientX - (window.innerWidth * pos.x) / 100,
      y: e.clientY - (window.innerHeight * pos.y) / 100,
    };

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      moved.current = true;
      setPos({
        x: ((ev.clientX - offset.current.x) / window.innerWidth) * 100,
        y: ((ev.clientY - offset.current.y) / window.innerHeight) * 100,
      });
    };

    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleClick = () => {
    if (!moved.current) onClick();
  };

  return (
    <div
      className="photo-frame"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseDown={onMouseDown}
      onClick={handleClick}
    >
      <div className="photo-frame-img">
        <Image
          src={src}
          alt=""
          fill
          sizes="120px"
          style={{ objectFit: "cover", objectPosition: "center" }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export default function PhotoWidget({ onClick }: PhotoWidgetProps) {
  return (
    <>
      {PHOTOS.map((photo, i) => (
        <DraggablePhoto
          key={photo.id}
          src={photo.src}
          id={photo.id}
          startX={photo.x}
          startY={photo.y}
          rotation={[-3, 2, -1.5, 1][i]}
          onClick={() => onClick(photo.id)}
        />
      ))}
    </>
  );
}
