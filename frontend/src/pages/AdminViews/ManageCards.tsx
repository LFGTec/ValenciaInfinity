import { useState, useEffect } from "react";
import type { Card, } from "../../services/cardsService"
import { getCards, addCard } from "../../services/cardsService"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
} from "lucide-react";

export function ManageCards(){

    const [showForm, setShowForm] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [formData, setForm] = useState({
    nombre: "",
    rareza: "",
    tipo: "",
    temporada: 0,
    numero: 0,
    });

    const [fileUpload, setFile] = useState<File | null>(null);
    

    useEffect(() => {
        const fetchCards = async () => {
          const data = await getCards();
          setCards(data);
          setLoading(false);
        };
    
        fetchCards();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
        await addCard(
        formData.nombre,
        formData.rareza,
        formData.tipo,
        formData.temporada,
        formData.numero,
        fileUpload || undefined
        );

        const newCards = await getCards();
        setCards(newCards);

        setForm({
        nombre: "",
        rareza: "",
        tipo: "",
        temporada: 0,
        numero: 0,
        });
        setFile(null);

        alert("Carta agregada correctamente");
    } catch (error) {
        console.error(error);
        alert("Error al guardar la carta");
    }
    };

    return (
        <div className="min-h-screen bg-content py-8">
            <div className="max-w-[1600px] mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
                    GESTIONAR <span className="text-vcf-orange">CARTAS</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Administra el catálogo completo de cartas coleccionables
                </p>
                </div>
                
                <div className="bg-card border-2 border-border rounded-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    
                        {/* Agregar Carta */}
                        <button
                        onClick={() => setShowForm(true)}
                        className="w-full md:w-auto px-6 py-3 bg-black border-2 border-black text-white rounded-lg font-black hover:bg-gray-900 hover:border-gray-900 transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                        >
                        <Plus size={20} />
                        AGREGAR CARTA
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {cards.map((card) => {
                                return (
                                <div
                                    key={card.uid}
                                    className="bg-card border-2 border-border rounded-lg overflow-hidden hover:border-vcf-orange transition-all hover:shadow-xl"
                                >
                                    {/* Imagen */}
                                    <div className="relative aspect-[2/3] bg-gradient-to-br from-vcf-orange/20 to-vcf-yellow/20">
                                    <img
                                        src={card.image_url || "/placeholder.png"}
                                        alt={card.nombre}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Rareza badge */}
                                    <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                                        {card.rareza}
                                    </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                    <h3 className="font-black text-lg text-foreground mb-2">
                                        {card.nombre}
                                    </h3>

                                    <p className="text-sm text-muted-foreground mb-1">
                                        <span className="font-bold">Tipo:</span> {card.tipo}
                                    </p>

                                    <p className="text-sm text-muted-foreground mb-1">
                                        <span className="font-bold">Temporada:</span> {card.temporada}
                                    </p>

                                    <p className="text-sm text-muted-foreground mb-3">
                                        <span className="font-bold">Número:</span> {card.numero}
                                    </p>

                                    {/* Acciones */}
                                    <div className="flex gap-2">
                                        <button className="flex-1 px-3 py-2 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] transition-all">
                                        Editar
                                        </button>

                                        <button className="px-3 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-900 transition-all">
                                        Eliminar
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Add Card Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-card border-2 border-vcf-orange rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-card border-b-2 border-border p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-foreground">
                        AGREGAR NUEVA <span className="text-vcf-orange">CARTA</span>
                    </h2>
                    <button
                        onClick={() => setShowForm(false)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X size={24} className="text-foreground" />
                    </button>
                    </div>

                    {/* Modal Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Card Name */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                        Nombre de la Carta *
                        </label>
                        <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) =>
                            setForm({ ...formData, nombre: e.target.value })
                        }
                        placeholder="Ej: Hugo Duro"
                        className="w-full px-4 py-3 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground"
                        />
                    </div>

                    {/* Card Value */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                        Tipo de carta *
                        </label>
                        <input
                        type="text"
                        required
                        value={formData.tipo}
                        onChange={(e) =>
                            setForm({ ...formData, tipo: e.target.value })
                        }
                        placeholder="Ej. Jugador"
                        className="w-full px-4 py-3 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground"
                        />
                    </div>

                     {/* Card TEMPORADA */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                        Temporada *
                        </label>
                        <input
                        type="number"
                        required
                        value={formData.temporada}
                        onChange={(e) =>
                            setForm({ ...formData, temporada: Number(e.target.value) })
                        }
                        placeholder="Ej. Jugador"
                        className="w-full px-4 py-3 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground"
                        />
                    </div>

                     {/* Card Numero */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                        Numero de la carta*
                        </label>
                        <input
                        type="number"
                        required
                        value={formData.numero}
                        onChange={(e) =>
                            setForm({ ...formData, numero: Number(e.target.value)})
                        }
                        placeholder="Ej. 2"
                        className="w-full px-4 py-3 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            Rareza *
                        </label>

                        <select
                            value={formData.rareza}
                            onChange={(e) =>
                            setForm({ ...formData, rareza: e.target.value })
                            }
                            className="w-full p-3 rounded-lg border border-border bg-background text-foreground"
                        >
                            <option value="">Selecciona una rareza</option>
                            <option value="Comun">Común</option>
                            <option value="Rara">Rara</option>
                            <option value="Epica">Épica</option>
                            <option value="Legendaria">Legendaria</option>
                        </select>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            Imagen
                        </label>

                        <div className="flex gap-2">
                            {/* Input oculto */}
                            <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                setFile(e.target.files[0]);
                                }
                            }}
                            />

                            {/* Fake input visual */}
                            <input
                            type="text"
                            readOnly
                            value={fileUpload ? fileUpload.name : "Selecciona un archivo..."}
                            className="flex-1 px-4 py-3 bg-muted border-2 border-transparent rounded-lg text-foreground"
                            />

                            {/* Botón que abre el file picker */}
                            <button
                            type="button"
                            onClick={() => document.getElementById("fileInput")?.click()}
                            className="px-4 py-3 bg-muted border-2 border-border rounded-lg hover:border-vcf-orange transition-all"
                            >
                            <Upload size={20} className="text-foreground" />
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            Deja vacío para usar imagen por defecto
                        </p>
                    </div>                    

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4 border-t-2 border-border">
                        <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 px-6 py-3 bg-muted border-2 border-border text-foreground rounded-lg font-bold hover:bg-card transition-all"
                        >
                        CANCELAR
                        </button>
                        <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-black border-2 border-black text-white rounded-lg font-bold hover:bg-gray-900 hover:border-gray-900 transition-all shadow-md hover:shadow-lg hover:scale-105"
                        >
                        AGREGAR CARTA
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            )}
        </div>
    );
}