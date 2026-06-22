import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSlidingTrack } from "@/hooks/use-sliding-track" // Path to hook above

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import { buttonVariants } from "@/components/ui/button"

interface SlidingPaginationProps extends React.ComponentProps<
  typeof Pagination
> {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function SlidingPagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
  ...props
}: SlidingPaginationProps) {
    const desktopW= 400
  const { translateX } = useSlidingTrack({ totalPages, currentPage, desktopW })

  return (
    <Pagination className={cn("select-none", className)} {...props}>
      <PaginationContent className="bottom-5 absolute z-10 flex items-center gap-1 rounded-full bg-accent p-3">
        {/* Previous Button */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "gap-1 pl-2.5 text-xs font-medium tracking-wider uppercase disabled:opacity-40"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>
        </PaginationItem>

        {/* Viewport Box Container with Edge Gradients */}
        <div
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "w-[150px] sm:w-[406px]" // 3 items on mobile, 6 items on desktop
            // "[mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]"
          )}
        >
          {/* Animated Internal Track */}
          <div
            className="flex items-center gap-1 transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1
              const isActive = page === currentPage
              return (
                <PaginationItem key={page} className="shrink-0">
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(page)
                    }}
                    isActive={isActive}
                    className={cn(
                      "h-9 w-9 border-none text-sm font-bold transition-colors",
                      isActive
                        ? "rounded-full bg-black text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"
                        : "bg-transparent text-gray-900 dark:text-gray-100"
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
          </div>
        </div>

        {/* Next Button */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "gap-1 pr-2.5 text-xs font-medium tracking-wider uppercase disabled:opacity-40"
            )}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
