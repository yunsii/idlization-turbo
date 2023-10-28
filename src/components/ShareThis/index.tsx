"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import React, { useEffect } from "react";

export interface IShareThisProps {}

const ShareThis: React.FC<IShareThisProps> = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (window.__sharethis__) {
      window.__sharethis__.initialize();
    }
  }, [pathname]);

  return (
    <>
      <Script
        src="https://platform-api.sharethis.com/js/sharethis.js#property=653bc5f6d92e3e001dab7f04&product=sticky-share-buttons&source=platform"
        async
      />
      <div
        className="sharethis-sticky-share-buttons [&_img]:inline-block ![&_.st-btn]:hover:w-[120px] ![&_.st-toggle]:hidden"
        data-url={pathname}
      />
    </>
  );
};

export default ShareThis;
