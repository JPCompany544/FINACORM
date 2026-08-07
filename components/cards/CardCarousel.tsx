"use client";

import * as React from "react";
import { CardItem } from "@/constants/mock-cards";
import { CardPreview } from "./CardPreview";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface CardCarouselProps {
  cards: CardItem[];
  selectedCardId: string;
  onSelectCard: (id: string) => void;
}

export const CardCarousel: React.FC<CardCarouselProps> = ({
  cards,
  selectedCardId,
  onSelectCard,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 360;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4 select-none relative group">
      {/* Scroll controls */}
      <div className="flex justify-between items-center select-none shrink-0 mb-1.5 gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          My Cards ({cards.length})
        </h3>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground cursor-pointer outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-custom-md border border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground cursor-pointer outline-none"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Swipeable Carousel */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {cards.map((card) => {
          const isSelected = card.id === selectedCardId;
          
          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card.id)}
              className="snap-start shrink-0 w-full max-w-[340px] cursor-pointer"
            >
              <div
                className={cn(
                  "p-1.5 rounded-custom-2xl border transition-all relative",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-soft ring-1 ring-primary"
                    : "border-transparent bg-transparent hover:scale-[1.01]"
                )}
              >
                {/* Highlight Check badge */}
                {isSelected && (
                  <div className="absolute right-3 top-3 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-30 shadow-soft">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                
                <CardPreview card={card} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
