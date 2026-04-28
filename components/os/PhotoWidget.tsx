"use client";

import Image from "next/image";

interface PhotoWidgetProps {
  onClick: () => void;
}

export default function PhotoWidget({ onClick }: PhotoWidgetProps) {
  return (
    <button className="photo-widget" onClick={onClick} title="View photo">
      <div className="photo-widget-img">
        <Image
          src="/os/mycorner.jpeg"
          alt="My Corner"
          fill
          sizes="140px"
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>
    </button>
  );
}
