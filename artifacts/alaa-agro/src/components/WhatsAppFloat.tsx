import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';

const WA_NUMBER = '79265705777'; // +7 (926) 570-57-77

const WA_MESSAGES = {
  en: "Hello, I'm interested in your agricultural products. I'd like to discuss a bulk purchase.",
  ru: "Здравствуйте, меня интересует ваша сельскохозяйственная продукция. Хотел бы обсудить оптовую закупку.",
};

export function WhatsAppFloat() {
  const { locale, pick } = useLocale();
  const [open, setOpen] = useState(false);

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGES[locale as 'en' | 'ru'] ?? WA_MESSAGES.en)}`;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Tooltip popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl shadow-2xl p-4 w-64 border border-[#d8cfc3]" style={{ background: '#FBF8F2' }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={14} />
            </button>
            <p className="text-[13px] font-semibold text-gray-900 mb-1 pe-4">
              {pick({ en: 'Chat directly on WhatsApp', ru: 'Пишите напрямую в WhatsApp', ar: 'تواصل معنا مباشرة على واتساب' })}
            </p>
            <p className="text-[12px] text-gray-500 mb-3 leading-snug">
              {pick({ en: 'Alaa Noufal · +7 (926) 570-57-77', ru: 'Алаа Ноуфал · +7 (926) 570-57-77', ar: 'علاء نوفل · +7 (926) 570-57-77' })}
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              {/* WhatsApp SVG icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {pick({ en: 'Start WhatsApp Chat', ru: 'Написать в WhatsApp', ar: 'ابدأ محادثة واتساب' })}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white"
        style={{ background: '#25D366' }}
        aria-label="WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: '#25D366' }} />
        {open
          ? <X size={22} />
          : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          )
        }
      </motion.button>
    </div>
  );
}
