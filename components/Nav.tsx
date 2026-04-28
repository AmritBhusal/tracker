"use client";

import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-3 bg-white/80 backdrop-blur-xl border-b border-orange-100/60 shadow-sm shadow-orange-50">
      <Link href="/" className="group flex items-center gap-3.5">
        <Image
          src="/logo.svg"
          alt="ToggleCorp Logo"
          width={180}
          height={40}
          priority
          className="h-10 w-auto transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="h-6 w-px bg-stone-200" />
        <span className="text-base font-semibold tracking-tight text-stone-700">
          Task-Tracker
        </span>
      </Link>     
    </nav>
  );
}