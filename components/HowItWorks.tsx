'use client';

import { motion } from 'framer-motion';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose Your Sources',
    body: 'Select from dozens of trusted outlets across Technology, Finance, Science, Sports, and more. NexusBrief learns your world.',
  },
  {
    step: '02',
    title: 'We Curate & Rank',
    body: 'Our engine fetches real articles then applies your preferred sorting — latest, most relevant, or most popular — to pick the top five.',
  },
  {
    step: '03',
    title: 'Delivered to You',
    body: 'Get your digest on your schedule — once daily or every few hours. Read, react, bookmark, and schedule articles to your calendar.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HowItWorks() {
  return (
    <section className="bg-[#F8F7F4] border-t border-[#E0DDD8] py-32 px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="font-montserrat text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] mb-16 text-center"
        >
          How It Works
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#E0DDD8]"
        >
          {HOW_IT_WORKS.map((item, i) => (
            <motion.div
              key={item.step}
              variants={cardVariants}
              whileHover="hover"
              className={`group relative p-12 flex flex-col transition-colors duration-500 ease-out cursor-crosshair overflow-hidden ${
                i < HOW_IT_WORKS.length - 1
                  ? 'border-b md:border-b-0 md:border-r border-[#E0DDD8]'
                  : ''
              }`}
            >
              {/* Hover Background Fill Animation */}
              <motion.div
                className="absolute inset-0 bg-[#0A0A0A] origin-bottom"
                initial={{ scaleY: 0 }}
                variants={{
                  hover: { scaleY: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
                }}
              />

              <div className="relative z-10 flex-1 flex flex-col">
                <motion.span
                  variants={{
                    hover: { color: '#FFFFFF', opacity: 0.5 }
                  }}
                  className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A8A8A] transition-colors duration-300"
                >
                  {item.step}
                </motion.span>
                <motion.h3
                  variants={{
                    hover: { color: '#FFFFFF' }
                  }}
                  className="font-playfair text-[28px] font-bold mt-8 mb-6 text-[#0A0A0A] transition-colors duration-300"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  variants={{
                    hover: { color: '#FFFFFF', opacity: 0.8 }
                  }}
                  className="font-garamond text-[17px] text-[#3D3D3D] leading-relaxed transition-colors duration-300 mb-12"
                >
                  {item.body}
                </motion.p>
                
                {/* Decorative Arrow that slides in on hover */}
                <div className="mt-auto overflow-hidden h-6">
                  <motion.div
                    variants={{
                      hidden: { y: 30, opacity: 0 },
                      hover: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className="flex justify-start text-[#FFFFFF]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
