import React from 'react'

import { Flame, Trophy, Calendar } from 'lucide-react'

type HeaderSectionProps = {
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
}


function HeaderSection({ currentStreak, longestStreak, totalDays }: HeaderSectionProps) {
    return (
        <>

            {/* Header */}

            <div className="mb-8 text-center" >
                <div className="inline-flex items-center gap-3 mb-4">
                    <Flame size={48} className="text-vcf-orange" />
                    <h1 className="text-4xl md:text-6xl font-black text-foreground">
                        RACHA DE <span className="text-vcf-orange">DÍAS</span>
                    </h1>
                    <Flame size={48} className="text-vcf-orange" />
                </div>
                <p className="text-xl text-muted-foreground">
                    Inicia sesión cada día y reclama increíbles recompensas
                </p>
            </div >

            {/* Streak Stats */}
            < div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" >
                <div className="bg-gradient-to-br from-vcf-orange to-[#e05516] rounded-2xl p-8 text-center shadow-2xl border-2 border-vcf-orange">
                    <Flame size={48} className="mx-auto mb-4 text-white" />
                    <div className="text-6xl font-black text-white mb-2">{currentStreak}</div>
                    <div className="text-lg font-bold text-white/90">RACHA ACTUAL</div>
                </div>

                <div className="bg-card border-2 border-border rounded-2xl p-8 text-center shadow-lg hover:border-vcf-orange transition-all">
                    <Trophy size={48} className="mx-auto mb-4 text-vcf-orange" />
                    <div className="text-6xl font-black text-foreground mb-2">{longestStreak}</div>
                    <div className="text-lg font-bold text-muted-foreground">RACHA MÁS LARGA</div>
                </div>

                <div className="bg-card border-2 border-border rounded-2xl p-8 text-center shadow-lg hover:border-vcf-orange transition-all">
                    <Calendar size={48} className="mx-auto mb-4 text-vcf-orange" />
                    <div className="text-6xl font-black text-foreground mb-2">{totalDays}</div>
                    <div className="text-lg font-bold text-muted-foreground">DÍAS TOTALES</div>
                </div>
            </ div>

            {/* Progress Bar */}
            <div className="bg-card border-2 border-border rounded-2xl p-8 mb-12 shadow-lg" >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-foreground">
                        PROGRESO SEMANAL
                    </h2>
                    <span className="text-lg font-bold text-vcf-orange">
                        {currentStreak}/7 días
                    </span>
                </div>
                <div className="w-full h-6 bg-muted rounded-full overflow-hidden border-2 border-border">
                    <div
                        className="h-full bg-gradient-to-r from-vcf-orange to-vcf-yellow transition-all duration-500"
                        style={{ width: `${(currentStreak / 7) * 100}%` }}
                    ></div>
                </div>
            </div >

        </>

    )
}

export default HeaderSection