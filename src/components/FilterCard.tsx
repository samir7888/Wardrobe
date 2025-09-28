"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function FilterCard({
  isProduct,
  tabs,
  onTabChange,
  activeIndex: externalActiveIndex,
}: {
  isProduct?: boolean;
  tabs?: string[];
  onTabChange?: (index: number, tab: string) => void;
  activeIndex?: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(externalActiveIndex || 0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (externalActiveIndex !== undefined) {
      setActiveIndex(externalActiveIndex);
    }
  }, [externalActiveIndex]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const overviewElement = tabRefs.current[0];
      if (overviewElement) {
        const { offsetLeft, offsetWidth } = overviewElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);
  if (!tabs) {
    return "No tabs available";
  }
  return (
    <div className="w-full overflow-x-auto">
      <Card
        className={`inline-flex min-w-max p-1 rounded-full tracking-wide font-normal border border-gray-300 ${
          isProduct ? "bg-brand-primary" : "bg-gray-200 dark:bg-transparent"
        }`}
      >
        <CardContent className="p-0">
          <div className="relative">
            {/* Hover Highlight */}
            <div
              className="absolute h-[30px] transition-all duration-300 ease-out bg-white rounded-3xl flex items-center"
              style={{
                ...hoverStyle,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
            />

            {/* Tabs */}
            <div className="relative flex space-x-[6px] items-center">
              {tabs.map((tab: string, index: number) => (
                <div
                  key={index}
                  ref={(el: HTMLDivElement | null) => {
                    tabRefs.current[index] = el;
                  }}
                  className={`px-3 sm:px-4 md:px-6 py-2 font-medium cursor-pointer rounded-3xl tracking-wide transition-colors duration-300 h-[30px] flex items-center justify-center ${
                    index === activeIndex
                      ? "bg-white text-black"
                      : `${
                          isProduct
                            ? "text-white hover:text-black"
                            : "text-gray-400"
                        }`
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    setActiveIndex(index);
                    onTabChange?.(index, tab);
                  }}
                >
                  <div className="text-xs sm:text-sm leading-5 whitespace-nowrap">
                    {tab}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
