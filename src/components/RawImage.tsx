"use client";

import { forwardRef, type ImgHTMLAttributes } from "react";

/* eslint-disable @next/next/no-img-element */
export const RawImage = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
  function RawImage(props, ref) {
    return <img ref={ref} {...props} alt={props.alt ?? ""} />;
  },
);
