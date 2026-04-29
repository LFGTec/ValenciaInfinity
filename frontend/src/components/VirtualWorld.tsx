import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapUsers } from '@/hooks/useMapUsers';
import Map from "@/components/features/Map";
import { useUserLocation } from '@/hooks/useUserLocations';
import type { UserFeatureCollection } from '@/types/mapTypes';


export function VirtualWorld() {
    useUserLocation()
    
    const { data, loading, error } = useMapUsers()

    const typedData = data as UserFeatureCollection | null

    return(
        <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
            <div className="mb-6">
                <h1 className="text-5xl font-black mb-4 text-foreground">
                MUNDO <span className="text-vcf-blue">VIRTUAL</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                Conecta con fans del Valencia CF en tiempo real
                </p>
            </div>

            {/*Espacio para el Mapa*/}

            <div className="bg-card border-2 border-vcf-blue rounded-t-xl rounded-b-xl overflow-hidden shadow-2xl">

                {loading && <div className="p-6">Cargando mapa...</div>}
                {error && <div className="p-6 text-red-500">{error}</div>}

                {!loading && !error && (
                    <Map data={typedData} />
                )}
            </div>

        </div>
    );
}