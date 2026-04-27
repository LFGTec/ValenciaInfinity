export function LiveScoreBoard() {
  return (
    <div className="bg-gradient-to-br from-black via-vcf-orange to-black text-white rounded-xl overflow-hidden shadow-2xl border-2 border-vcf-orange">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-vcf-red rounded-full animate-pulse"></div>
            <span className="text-sm font-bold">EN VIVO</span>
          </div>
          <div className="text-2xl font-black text-vcf-yellow">67'</div>
          <div className="text-sm font-bold">LA LIGA</div>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-vcf-orange to-vcf-yellow rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl">
              <span className="text-3xl font-black text-white">VCF</span>
            </div>
            <h3 className="text-xl font-black mb-1">VALENCIA CF</h3>
            <div className="text-5xl font-black text-vcf-yellow mb-2">2</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-black opacity-50">VS</div>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-xl">
              <span className="text-2xl font-black text-black">RMA</span>
            </div>
            <h3 className="text-xl font-black mb-1">REAL MADRID</h3>
            <div className="text-5xl font-black mb-2">1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
