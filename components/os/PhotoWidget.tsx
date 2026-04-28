"use client";

import { useState } from "react";
import Image from "next/image";

const PHOTOS = [
  { src: "/os/mycorner.jpeg", id: "photo" },
  { src: "/os/bike.jpeg", id: "photo2" },
  { src: "/os/small-me.jpeg", id: "photo3" },
];

interface PhotoWidgetProps {
  onClick: (id: string) => void;
}

export default function PhotoWidget({ onClick }: PhotoWidgetProps) {
  const [index, setIndex] = useState(0);
  const photo = PHOTOS[index];

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % PHOTOS.length);
  };

  return (
    <button className="photo-widget" onClick={() => onClick(photo.id)} title="Click to view">
      <div className="photo-widget-img">
        <Image
          src={photo.src}
          alt="Photo"
          fill
          sizes="140px"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>
      <div className="photo-widget-nav" onClick={next}>
        {PHOTOS.map((_, i) => (
          <span key={i} className={`photo-widget-dot${i === index ? " active" : ""}`} />
        ))}
      </div>
    </button>
  );
}
