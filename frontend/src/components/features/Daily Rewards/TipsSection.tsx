import React from 'react'
import { Zap } from 'lucide-react'


function TipsSection() {
    return (
        < div className="bg-gradient-to-r from-black to-gray-900 rounded-2xl p-8 text-white border-2 border-vcf-orange shadow-2xl" >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-vcf-orange rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-black mb-3">CONSEJOS PARA MANTENER TU RACHA</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-vcf-orange rounded-full"></div>
                            Inicia sesión todos los días para mantener tu racha activa
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-vcf-orange rounded-full"></div>
                            Reclama tus recompensas diarias antes de la medianoche
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-vcf-orange rounded-full"></div>
                            Los días 7, 14, 21 y 28 tienen bonos especiales
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-vcf-orange rounded-full"></div>
                            Si pierdes tu racha, tendrás que empezar desde el día 1
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TipsSection