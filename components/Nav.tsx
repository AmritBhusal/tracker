import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-surface/90 backdrop-blur-xl border-b border-[#FF5500]/10 shadow-sm">
      <Link href="/" className="group flex items-center gap-3.5">
        <Image
          src="/logo.svg"
          alt="ToggleCorp Logo"
          width={180}
          height={40}
          priority
          className="h-10 w-auto transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="text-lg font-semibold tracking-tight text-stone-700">
          Task-Tracker
        </span>
      </Link>
    </nav>
  );
}