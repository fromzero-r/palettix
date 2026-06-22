import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

// --- Single Phone Frame ---
export default function PhoneFrame({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className="relative flex shrink-0 flex-col items-center">
      {/* Buttons */}
      <div className="absolute top-[90px] -right-[4px] h-[30px] w-[4px] rounded-sm bg-[#2a2a2a]" />
      <div className="absolute top-[130px] -right-[4px] h-[30px] w-[4px] rounded-sm bg-[#2a2a2a]" />
      <div className="absolute top-[100px] -left-[5px] h-[50px] w-[4px] rounded-sm bg-[#2a2a2a]" />
      {/* Outer shell */}
      <div
        className={cn(
          "relative z-2 no-scrollbar w-[200px] shrink-0 overflow-y-auto rounded-[44px] border-[9px] border-[#1a1a1a] shadow-[0_0_0_1px_#3a3a3a,inset_0_0_0_1px_#333] md:w-[250px]",
          className
        )}
      >
        {/* Screen */}
        <div className="flex h-[490px] w-full flex-col rounded-[36px]">
          <div className="relative flex-1">
            {children ?? (
              <div className="flex h-full w-full items-center justify-center p-4 text-center font-sans text-[13px] text-[#ccc]">
                Your content here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      {label && (
        <p className="mt-[14px] font-sans text-[13px] tracking-[0.02em] text-[#888]">
          {label}
        </p>
      )}
    </div>
  )
}
