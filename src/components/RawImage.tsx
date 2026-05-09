"use client";

import type { ImgHTMLAttributes } from "react";

/* eslint-disable @next/next/no-img-element */
export function RawImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} alt={props.alt ?? ""} />;
}
