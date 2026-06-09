import { AvatarSection } from "../components/features/avatar/AvatarSection";

export function AvatarPage() {
  return (
    <div className="h-[calc(100vh-90px)] overflow-hidden flex flex-col max-w-[1400px] mx-auto px-4 bg-content">
      <div className="flex-shrink-0 pt-8 pb-4">
        <h1 className="text-3xl md:text-5xl font-black mb-3 text-foreground">
          PERSONALIZA TU <span className="text-vcf-orange">CHEMATE</span>
        </h1>
        <p className="text-base text-muted-foreground">
          Crea tu identidad única como valencianista
        </p>
      </div>

      <div className="flex-1 min-h-0 pb-4">
        <AvatarSection />
      </div>
    </div>
  );
}
