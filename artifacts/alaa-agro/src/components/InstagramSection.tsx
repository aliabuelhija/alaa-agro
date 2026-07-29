import React from 'react';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const placeholders = [
  { id: 1, type: 'field' },
  { id: 2, type: 'seeds' },
  { id: 3, type: 'logistics' },
  { id: 4, type: 'quality' },
  { id: 5, type: 'harvest' },
  { id: 6, type: 'office' },
];

export function InstagramSection() {
  return (
    <section className="py-20 bg-background overflow-hidden relative border-t border-border/50">
      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
        <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Follow Our Growth</h2>
        <p className="text-muted-foreground mb-8">Join us on Instagram for updates from the fields and operations.</p>
        <a 
          href="https://www.instagram.com/alaa_agro?utm_source=qr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground hover:border-accent hover:text-accent transition-all hover-elevate"
        >
          <Instagram size={20} />
          <span>@alaa_agro</span>
        </a>
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4">
        {/* Fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
          {placeholders.map((post, i) => (
            <motion.a
              href="https://www.instagram.com/alaa_agro?utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex-none w-64 h-64 md:w-80 md:h-80 rounded-xl overflow-hidden group snap-center bg-muted border border-border"
              data-cursor-text="Instagram"
            >
              {/* This would be an actual image in production */}
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                <Instagram className="text-primary/20 w-16 h-16" />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white text-sm font-medium">View on Instagram</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}