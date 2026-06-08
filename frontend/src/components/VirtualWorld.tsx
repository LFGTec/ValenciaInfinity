import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapUsers } from '@/hooks/useMapUsers';
import Map from "@/components/features/Map";
import { useUserLocation } from '@/hooks/useUserLocations';
import type { UserFeatureCollection } from '@/types/mapTypes';
import { useAuth } from '@/hooks/useAuth';
import {
  Navigation,
} from "lucide-react";
import { useUserLocationStatus } from '@/hooks/useUserLocationsStatus';
import { useActivateLocation } from '@/hooks/useActivateLocation';


export function VirtualWorld() {
    const { saveLocation } = useUserLocation()
    const { user } = useAuth()
    const { data, loading, error } = useMapUsers()
    const typedData = data as UserFeatureCollection | null
    const { activateLocation, loadingActivate } = useActivateLocation();

    const {
        locationSaved,
        isVisible,
        setLocationSaved,
        loadinguserLocation,
        refetch
        } = useUserLocationStatus(user?.id);

    const handleActivate = async () => {
    if (!user) return;

    const ok = await activateLocation(user, saveLocation);

    if (ok) {
        await refetch(); 
    }
    };
   

    return(
        <div className="min-h-screen max-w-[1600px] mx-auto px-4 py-6 bg-content">
            <div className="mb-6">
                <h1 className="text-5xl font-black mb-4 text-foreground">
                MUNDO <span className="text-vcf-orange">VIRTUAL</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                Conecta con fans del Valencia CF en tiempo real
                </p>
            </div>

            {/*Espacio para el Mapa*/}

            <div className="bg-card border-2 border-vcf-blue rounded-t-xl p-4 flex items-center justify-between">
                <button
                onClick={handleActivate}
                disabled={loadinguserLocation || locationSaved}
                className={`
                    px-4 py-2 rounded-lg font-bold transition-colors text-sm flex items-center gap-2
                    ${
                    !locationSaved
                        ? "bg-vcf-orange text-white hover:bg-[#a86d12]"
                        : isVisible
                        ? "bg-green-600 text-white cursor-default"
                        : "bg-gray-500 text-white cursor-default"
                    }
                    ${loadinguserLocation ? "opacity-70 cursor-wait" : ""}
                `}
                >
                <Navigation size={16} />            
                {loadinguserLocation
                ? "Cargando..."
                : !locationSaved
                ? "Activar ubicación"
                : isVisible
                ? "Compartiendo ubicación"
                : "No compartiendo ubicación"}
                </button>
            </div>

            <div className="bg-card border-2 border-vcf-blue border-t-0 rounded-b-xl overflow-hidden shadow-2xl">

                {loading && <div className="p-6">Cargando mapa...</div>}
                {error && <div className="p-6 text-red-500">{error}</div>}

                {!loading && !error && (
                    <Map data={typedData} />
                )}
            </div>

        </div>
    );
}