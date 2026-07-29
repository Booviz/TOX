import Image from "next/image";
import { cn } from "@/lib/utils";

type ToxLogoProps = {
  className?: string;
  showText?: boolean;
  size?: number;
};

export function ToxLogo({
  className,
  showText = true,
  size = 42,
}: ToxLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <div
        className="relative overflow-hidden rounded-full border border-violet-500/25 bg-[#0B0F1A] shadow-[0_0_18px_rgba(139,92,246,0.25)]"
        style={{
          width: size,
          height: size,
        }}
      >
        <Image
          src="/logo.png"
          alt="TOX Platform"
          fill
          priority
          className="object-cover scale-[1.0] select-none"
        />
      </div>

      {showText && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight text-white">
            TOX
          </span>

          <span className="mt-0.5 text-[9px] font-medium tracking-[0.35em] text-zinc-500 uppercase">
            PLATFORM
          </span>
        </span>
      )}
    </span>
  );
}