import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useReducedMotion } from 'framer-motion';

interface CarouselProduct {
  name: string;
  image: string;
  category: string;
}

export const HERO_CAROUSEL_PRODUCTS: CarouselProduct[] = [
  { name: 'Wheat',          image: 'wheat_2.jpg',          category: 'Grains' },
  { name: 'Corn / Maize',   image: 'corn_2.jpg',           category: 'Grains' },
  { name: 'Barley',         image: 'barley_2.jpg',         category: 'Grains' },
  { name: 'Rice',           image: 'rice_2.jpg',           category: 'Grains' },
  { name: 'Buckwheat',      image: 'buckwheat_2.jpg',      category: 'Grains' },
  { name: 'Chickpeas',      image: 'chickpeas_2.jpg',      category: 'Pulses' },
  { name: 'Lentils',        image: 'lentils_2.jpg',        category: 'Pulses' },
  { name: 'Green Peas',     image: 'peas_2.jpg',           category: 'Pulses' },
  { name: 'Yellow Peas',    image: 'yellow-peas_2.jpg',    category: 'Pulses' },
  { name: 'Brown Flaxseed', image: 'brown-flaxseed_2.jpg', category: 'Oilseeds' },
  { name: 'Sunflower Seeds',image: 'sunflower-seeds_2.jpg',category: 'Oilseeds' },
  { name: 'Spring Vetch',   image: 'spring-vetch_2.jpg',   category: 'Seeds' },
  { name: 'Coriander',      image: 'coriander_2.jpg',      category: 'Seeds' },
  { name: 'Sunflower Oil',  image: 'sunflower-oil_2.jpg',  category: 'Vegetable Oils' },
];

export function HeroCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    dragFree: false,
    watchDrag: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  // Autoplay — 7 s, pauses on hover and reduced-motion
  useEffect(() => {
    if (!emblaApi || isHovered || prefersReducedMotion) return;
    const id = setInterval(() => emblaApi.scrollNext(), 7000);
    return () => clearInterval(id);
  }, [emblaApi, isHovered, prefersReducedMotion]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Embla viewport ── */}
      <div ref={emblaRef} className="overflow-hidden" style={{ padding: '18px 0 18px' }}>
        <div
          className="flex touch-pan-y"
          style={{ marginLeft: '-6px', marginRight: '-6px' }}
        >
          {HERO_CAROUSEL_PRODUCTS.map((product, index) => {
            const isActive = index === selectedIndex;
            return (
              <div
                key={`${product.name}-${index}`}
                className="shrink-0 w-[78%] md:w-[42%]"
                style={{ padding: '0 6px' }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: '3/4',
                    borderRadius: '4px',
                    border: isActive
                      ? '1px solid rgba(194,154,61,0.70)'
                      : '1px solid rgba(255,255,255,0.07)',
                    boxShadow: isActive
                      ? '0 24px 64px rgba(0,0,0,0.80), 0 4px 16px rgba(194,154,61,0.12)'
                      : '0 6px 24px rgba(0,0,0,0.55)',
                    transform: isActive ? 'scale(1.04)' : 'scale(0.94)',
                    transition: 'transform 0.65s cubic-bezier(.16,1,.3,1), border-color 0.45s ease, box-shadow 0.55s ease, opacity 0.45s ease',
                    opacity: isActive ? 1 : 0.62,
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}products/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{
                      transform: isActive ? 'scale(1.0)' : 'scale(1.03)',
                      transition: 'transform 0.65s cubic-bezier(.16,1,.3,1)',
                      filter: isActive ? 'none' : 'brightness(0.85) saturate(0.9)',
                    }}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                  />

                  {/* Bottom gradient for label */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, transparent 45%, rgba(8,5,1,0.68) 68%, rgba(8,5,1,0.96) 100%)',
                    }}
                  />

                  {/* Active: hairline top-edge gold accent */}
                  {isActive && (
                    <div
                      className="absolute top-0 left-0 right-0 pointer-events-none"
                      style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C29A3D 30%, #D4AF4C 50%, #C29A3D 70%, transparent)', borderRadius: '4px 4px 0 0' }}
                    />
                  )}

                  {/* Product label */}
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ padding: '0 18px 16px' }}
                  >
                    <p
                      style={{
                        color: '#C29A3D',
                        fontSize: '7px',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        marginBottom: '4px',
                        opacity: isActive ? 1 : 0.50,
                        transition: 'opacity 0.4s',
                      }}
                    >
                      {product.category}
                    </p>
                    <p
                      style={{
                        color: isActive ? '#F6F3EC' : 'rgba(246,243,236,0.65)',
                        fontSize: 'clamp(13px, 1.3vw, 16px)',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontWeight: 500,
                        lineHeight: 1.15,
                        transition: 'color 0.4s',
                      }}
                    >
                      {product.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Controls: thin gold rule + prev · indicator · next ── */}
      <div style={{ borderTop: '1px solid rgba(194,154,61,0.14)', paddingTop: '16px' }}>
        <div className="flex items-center justify-between px-2">

          {/* Prev */}
          <button
            onClick={scrollPrev}
            aria-label="Previous product"
            className="flex items-center justify-center shrink-0"
            style={{
              width: '32px', height: '32px',
              border: '1px solid rgba(194,154,61,0.28)',
              borderRadius: '2px',
              color: 'rgba(194,154,61,0.75)',
              background: 'transparent',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
              letterSpacing: '0',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = '#C29A3D'; el.style.color = '#C29A3D'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(194,154,61,0.28)'; el.style.color = 'rgba(194,154,61,0.75)'; }}
          >
            ←
          </button>

          {/* Product counter — cleaner than 14 dots */}
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '15px', color: '#C29A3D', fontWeight: 500, lineHeight: 1 }}>
              {String(selectedIndex + 1).padStart(2, '0')}
            </span>
            <div style={{ width: '40px', height: '1px', background: 'rgba(194,154,61,0.22)', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '1px',
                width: `${((selectedIndex + 1) / HERO_CAROUSEL_PRODUCTS.length) * 100}%`,
                background: '#C29A3D',
                transition: 'width 0.45s ease',
              }} />
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(194,154,61,0.40)', letterSpacing: '0.1em' }}>
              {String(HERO_CAROUSEL_PRODUCTS.length).padStart(2, '0')}
            </span>
          </div>

          {/* Next */}
          <button
            onClick={scrollNext}
            aria-label="Next product"
            className="flex items-center justify-center shrink-0"
            style={{
              width: '32px', height: '32px',
              border: '1px solid rgba(194,154,61,0.28)',
              borderRadius: '2px',
              color: 'rgba(194,154,61,0.75)',
              background: 'transparent',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = '#C29A3D'; el.style.color = '#C29A3D'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(194,154,61,0.28)'; el.style.color = 'rgba(194,154,61,0.75)'; }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
