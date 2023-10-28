"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { rIC } from "idlization";

export interface IShareThisTurboProps {}

const ShareThisTurbo: React.FC<IShareThisTurboProps> = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    rIC(() => {
      if (window.__sharethis__) {
        window.__sharethis__.initialize();
      }
      const script = document.createElement("script");
      const head = document.getElementsByTagName("head")[0];
      script.src =
        "https://platform-api.sharethis.com/js/sharethis.js#property=653bc5f6d92e3e001dab7f04&product=sticky-share-buttons&source=platform";
      head.appendChild(script);
    });
  }, [mounted, pathname]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div
        className="sharethis-sticky-share-buttons [&_img]:inline-block ![&_.st-btn]:hover:w-[120px] ![&_.st-toggle]:hidden"
        data-url={`${window.location.origin}${pathname}`}
      />
    </>
  );
};

export default ShareThisTurbo;
