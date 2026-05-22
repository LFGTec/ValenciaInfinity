import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { type Card } from "../../services/cardsService";

interface PackOpenAnimationProps {
  isOpen: boolean;
  cards: Card[];
  onClose: () => void;
}

export function PackOpenAnimation({ isOpen, cards, onClose }: PackOpenAnimationProps) {
  const [packOpened, setPackOpened] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [cardRotations, setCardRotations] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    if (isOpen) {
      setPackOpened(false);
      setShowCards(false);
      setCardRotations({});
    }
  }, [isOpen]);

  const handlePullTab = () => {
    setPackOpened(true);
    setTimeout(() => setShowCards(true), 1000);
  };

  const handleCardMouseMove = (cardId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;

    setCardRotations(prev => ({
      ...prev,
      [cardId]: { x: x * 30, y: y * 30 }
    }));
  };

  const handleCardMouseLeave = (cardId: string) => {
    setCardRotations(prev => ({
      ...prev,
      [cardId]: { x: 0, y: 0 }
    }));
  };

  // Confetti effect
  const Confetti = () => {
    const confetti = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 0.4,
      duration: 2.5 + Math.random() * 1.5,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      rotation: Math.random() * 360,
    }));

    return (
      <>
        {confetti.map((item) => (
          <motion.div
            key={item.id}
            className="fixed w-3 h-3 pointer-events-none"
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: item.x,
              y: item.y,
              opacity: 0,
              rotate: item.rotation,
            }}
            transition={{ duration: item.duration, delay: item.delay, type: "spring", damping: 8 }}
            style={{
              background: ["#ff6b35", "#f7931e", "#fdb913"][Math.floor(Math.random() * 3)],
              borderRadius: "50%",
            }}
          />
        ))}
      </>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-b from-black/60 to-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !packOpened && onClose()}
        >
          {packOpened && <Confetti />}

          <motion.div
            className="relative w-full max-w-3xl px-4 mx-auto"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!packOpened ? (
              // Pack Closed State
              <motion.button
                onClick={handlePullTab}
                className="relative mx-auto w-72 h-96 focus:outline-none"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                {/* Main Pack */}
                <div className="absolute inset-0 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-vcf-orange via-vcf-orange to-red-600 flex flex-col items-center justify-center relative">
                    {/* Holographic shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      animate={{ x: [-500, 500], opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />

                    {/* Secondary shine */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
                      animate={{ opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <p className="text-white font-black text-7xl mb-3 drop-shadow-lg">📦</p>
                      </motion.div>
                      <p className="text-white font-black text-3xl drop-shadow-lg">SOBRE</p>
                      <p className="text-white/90 text-lg font-bold mt-2 drop-shadow">DE CARTAS</p>
                    </div>

                    {/* Decorative corner elements */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-2 border-white/40 rounded-lg" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-2 border-white/40 rounded-lg" />
                  </div>
                </div>

                {/* Secondary layer for depth */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-t from-red-700/50 to-transparent"
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Hint Text */}
                <motion.p
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold z-30"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Haz click para abrir
                </motion.p>
              </motion.button>
            ) : (
              // Cards Reveal State
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                {/* Opened Pack with fade effect */}
                <motion.div
                  className="mx-auto w-72 h-20 rounded-3xl shadow-xl overflow-hidden mb-12"
                  initial={{ rotateX: 0, opacity: 1 }}
                  animate={{ rotateX: 75, opacity: 0.6 }}
                  transition={{ duration: 0.8 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-vcf-orange to-red-600" />
                </motion.div>

                {/* Cards Title */}
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-center text-white font-black text-2xl mb-6 drop-shadow-lg"
                >
                  ¡{cards.length} cartas reveladas!
                </motion.h2>

                {/* Cards Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showCards ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-5 gap-2 px-4 mb-6 max-w-4xl mx-auto"
                >
                  {cards.map((card, index) => {
                    const rotation = cardRotations[card.id] || { x: 0, y: 0 };

                    return (
                      <motion.div
                        key={card.id}
                        initial={{
                          opacity: 0,
                          scale: 0.3,
                          rotateY: 180,
                          rotateZ: Math.random() * 20 - 10,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotateY: 0,
                          rotateZ: 0,
                        }}
                        transition={{
                          delay: 0.7 + index * 0.12,
                          duration: 0.9,
                          type: "spring",
                          stiffness: 70,
                          damping: 15,
                        }}
                        className="group relative"
                        style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                        onMouseMove={(e) => handleCardMouseMove(card.id, e)}
                        onMouseLeave={() => handleCardMouseLeave(card.id)}
                      >
                        <motion.div
                          animate={{
                            rotateX: rotation.x,
                            rotateY: rotation.y,
                          }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                          className="w-full"
                          style={{ transformStyle: "preserve-3d", aspectRatio: "2.5/3.5" }}
                        >
                          {/* Card Base - with enhanced holographic effect */}
                          <div
                            className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden"
                            style={{
                              background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                              filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.3))",
                            }}
                          >
                            {/* Card Image */}
                            {card.image_url && (
                              <motion.img
                                src={card.image_url}
                                alt={card.name}
                                className="w-full h-full object-cover"
                                animate={{ scale: [1, 1.02] }}
                                transition={{ duration: 0.3 }}
                              />
                            )}

                            {/* Fallback */}
                            {!card.image_url && (
                              <div className="w-full h-full bg-gradient-to-br from-vcf-orange/40 to-vcf-yellow/40 flex flex-col items-center justify-center p-4">
                                <p className="font-black text-center text-gray-800 text-sm break-words">
                                  {card.name}
                                </p>
                                <p className="text-xs text-gray-600 font-bold mt-2">#{card.season}</p>
                              </div>
                            )}

                            {/* Holographic Foil Effect - Static Layer */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
                              style={{
                                backgroundImage: `
                                  linear-gradient(105deg, rgba(138, 43, 226, 0.3) 0%, transparent 40%),
                                  linear-gradient(200deg, rgba(0, 191, 255, 0.3) 0%, transparent 40%),
                                  linear-gradient(270deg, rgba(255, 215, 0, 0.2) 0%, transparent 40%),
                                  linear-gradient(45deg, rgba(255, 105, 180, 0.2) 0%, transparent 40%)
                                `,
                                backgroundSize: "200% 200%, 200% 200%, 200% 200%, 200% 200%",
                              }}
                            />

                            {/* Dynamic Holographic Reflection - Follows Mouse */}
                            <motion.div
                              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                              animate={{
                                backgroundPosition: [
                                  `${rotation.y * 20}px ${rotation.x * 20}px`,
                                ],
                              }}
                              style={{
                                backgroundImage: `
                                  radial-gradient(circle at center, rgba(255, 255, 255, 0.8), transparent 70%)
                                `,
                                backgroundSize: "400% 400%",
                                mixBlendMode: "screen",
                              }}
                            />

                            {/* Chromatic Aberration Effect */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                              style={{
                                backgroundImage: `
                                  linear-gradient(0deg, transparent 0%, rgba(0, 255, 136, 0.3) 50%, transparent 100%)
                                `,
                                mixBlendMode: "lighten",
                                filter: "blur(1px)",
                              }}
                            />

                            {/* Shine Effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 pointer-events-none"
                              animate={{ x: [300, -300] }}
                              transition={{
                                duration: 0.6,
                              }}
                              style={{
                                mixBlendMode: "overlay",
                              }}
                            />

                            {/* Border with gradient effect */}
                            <div
                              className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                border: "2px solid",
                                borderImage: "linear-gradient(135deg, #ff1493, #00bfff, #ffff00) 1",
                              }}
                            />

                            {/* Rarity Badge with glow */}
                            {card.rarity && (
                              <motion.div
                                className={`absolute top-3 right-3 px-4 py-2 rounded-xl text-xs font-black text-white shadow-lg backdrop-blur-sm ${
                                  card.rarity === "legendary" || card.rarity === "legendaria"
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                    : card.rarity === "epic" || card.rarity === "epica"
                                    ? "bg-gradient-to-r from-purple-500 to-purple-600"
                                    : card.rarity === "rare" || card.rarity === "rara"
                                    ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                                }`}
                                style={{
                                  boxShadow: card.rarity === "legendary" || card.rarity === "legendaria"
                                    ? "0 0 20px rgba(255, 215, 0, 0.6)"
                                    : card.rarity === "epic" || card.rarity === "epica"
                                    ? "0 0 20px rgba(147, 51, 234, 0.6)"
                                    : card.rarity === "rare" || card.rarity === "rara"
                                    ? "0 0 20px rgba(59, 130, 246, 0.6)"
                                    : "0 0 20px rgba(156, 163, 175, 0.4)",
                                }}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  delay: 0.9 + index * 0.12,
                                  type: "spring",
                                  stiffness: 150,
                                }}
                              >
                                {card.rarity}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mx-auto block px-10 py-4 bg-gradient-to-r from-vcf-orange to-vcf-yellow hover:from-vcf-orange/90 hover:to-vcf-yellow/90 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all"
                >
                  Continuar
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
