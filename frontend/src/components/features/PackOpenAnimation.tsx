import { motion, AnimatePresence } from "framer-motion";
import { type Card } from "../../services/cardsService";

interface PackOpenAnimationProps {
	isOpen: boolean;
	cards: Card[];
	onClose: () => void;
}

export function PackOpenAnimation({ isOpen, cards, onClose }: PackOpenAnimationProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="relative w-full max-w-2xl"
						initial={{ scale: 0.3, rotateX: 90 }}
						animate={{ scale: 1, rotateX: 0 }}
						exit={{ scale: 0.3, rotateX: -90 }}
						onClick={(e) => e.stopPropagation()}
						style={{ transformStyle: "preserve-3d" }}
					>
						{/* Sobre - Animación de apertura */}
						<motion.div
							className="mx-auto w-64 h-80 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden"
							animate={{ rotateX: 0, rotateY: 0 }}
							style={{ transformStyle: "preserve-3d" }}
						>
							{/* Brillo/Shimmer del sobre */}
							<motion.div
								className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
								animate={{ opacity: [0, 0.3, 0] }}
								transition={{ duration: 0.8, delay: 0.2 }}
								style={{ transformStyle: "preserve-3d" }}
							/>

							{/* Contenido del sobre */}
							{cards.length > 0 ? (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5, duration: 0.6 }}
									className="text-center z-10"
								>
									<p className="text-white font-black text-5xl mb-4">📦</p>
									<p className="text-white font-bold text-lg mb-2">¡Sobre abierto!</p>
									<p className="text-white/90 text-sm">{cards.length} cartas reveladas</p>
								</motion.div>
							) : null}
						</motion.div>

						{/* Cartas reveladas - Grid con animación stagger */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8, duration: 0.6 }}
							className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 px-4"
						>
							{cards.map((card, index) => (
								<motion.div
									key={card.id}
									initial={{ opacity: 0, scale: 0, rotateY: 180 }}
									animate={{ opacity: 1, scale: 1, rotateY: 0 }}
									transition={{
										delay: 1 + index * 0.1,
										duration: 0.6,
										type: "spring",
										stiffness: 100,
									}}
									className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform"
									style={{ transformStyle: "preserve-3d" }}
									whileHover={{ scale: 1.15, rotateY: 5 }}
								>
									{/* Card Image */}
									{card.image_url && (
										<img
											src={card.image_url}
											alt={card.nombre}
											className="w-full h-full object-cover"
										/>
									)}
									{!card.image_url && (
										<div className="w-full h-full bg-gradient-to-br from-vcf-orange/20 to-vcf-yellow/20 flex items-center justify-center">
											<div className="text-center">
												<p className="font-black text-lg text-gray-700">{card.nombre}</p>
												<p className="text-xs text-gray-500 mt-1">#{card.numero}</p>
											</div>
										</div>
									)}

									{/* Card Rarity Badge */}
									{card.rareza && (
										<motion.div
											className="absolute top-2 right-2 bg-vcf-orange text-white px-2 py-1 rounded text-xs font-bold"
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: 1.3 + index * 0.1 }}
										>
											{card.rareza}
										</motion.div>
									)}
								</motion.div>
							))}
						</motion.div>

						{/* Close Button */}
						<motion.button
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 2 }}
							onClick={onClose}
							className="mt-8 w-full px-6 py-3 bg-vcf-orange hover:bg-vcf-orange/90 text-white font-bold rounded-lg transition-colors"
						>
							Cerrar
						</motion.button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
