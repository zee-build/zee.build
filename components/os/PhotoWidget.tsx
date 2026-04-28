"use client";

import { useState } from "react";
import Image from "next/image";

interface PhotoWidgetProps {
  onOpenAbout: () => void;
}

export default function PhotoWidget({ onOpenAbout }: PhotoWidgetProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={`photo-widget${hovered ? " hovered" : ""}`}
      onClick={onOpenAbout}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Open About"
    >
      <div className="photo-widget-img">
        <Image
          src="/os/mycorner.jpeg"
          alt="Ziyan"
          fill
          sizes="80px"
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
        />
      </div>
      {hovered && (
        <div className="photo-widget-tooltip">
          Ziyan Bin Anoos
          <span>Click to open →</span>
        </div>
      )}
    </button>
  );
}
