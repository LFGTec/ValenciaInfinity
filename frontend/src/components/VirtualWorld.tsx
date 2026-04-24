import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import { getMapUsers } from '@/services/mapService';
import { useMapUsers } from '@/hooks/useMapUsers';
import Map from "@/components/features/Map"


export function VirtualWorld() {
    const geoData = useMapUsers()

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

            <div className="bg-card border-2 border-vcf-blue border-t-0 rounded-b-xl overflow-hidden shadow-2xl">
                <Map data={geoData} />
            </div>

        </div>
    );
}