import { useState, useEffect } from "react";
import type { Card, } from "../../services/cardsService"
import { getCards, addCard } from "../../services/cardsService"
import {
  Plus,
  Search,
  Filter,
  X,
  Upload,
  Star,
  Sparkles,
  Gem,
  Award,
} from "lucide-react";
import { Toast } from "@/components/ui.disabled/Toast";

export function ManageCards(){

    const [showForm, setShowForm] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>("Todas");
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);


    console.log(loading)
    const categories = [
        {
        id: "Todas",
        label: "Todas",
        color: "bg-black",
        borderColor: "border-black",
        icon: Filter,
        textColor: "text-black",
        },
        {
        id: "Comun",
        label: "Común",
        color: "bg-gray-400",
        borderColor: "border-gray-400",
        icon: Star,
        textColor: "text-gray-400",
        },
        {
        id: "Raro",
        label: "Raro",
        color: "bg-[#CD7F32]",
        borderColor: "border-[#CD7F32]",
        icon: Sparkles,
        textColor: "text-[#CD7F32]",
        },
        {
        id: "Epica",
        label: "Épico",
        color: "bg-purple-600",
        borderColor: "border-purple-600",
        icon: Gem,
        textColor: "text-purple-600",
        },
        {
        id: "Legendario",
        label: "Legendario",
        color: "bg-[#FFD700]",
        borderColor: "border-[#FFD700]",
        icon: Award,
        textColor: "text-[#FFD700]",
        },
    ];

    const getCategoryColor = (category: string) => {
        const cat = categories.find((c) => c.id === category);
        return cat?.color || "bg-gray-400";
    };

    const getCategoryIcon = (category: string) => {
        const cat = categories.find((c) => c.id === category);
        return cat?.icon || Star;
    };

    // Form
    const [formData, setForm] = useState({
    nombre: "",
    rareza: "",
    tipo: "",
    temporada: "" as any,
    numero: "" as any,
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

    // Validación
    if (!formData.nombre.trim()) {
      setToast({
        message: "El nombre de la carta es obligatorio",
        type: "error",
      });
      return;
    }

    if (!formData.numero || parseInt(formData.numero) <= 0) {
      setToast({
        message: "El valor de la carta debe ser mayor a 0",
        type: "error",
      });
      return;
    }

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
        setShowForm(false);

        setToast({
        message: `Carta "${formData.nombre}" creada exitosamente`,
        type: "success",
        });
    } catch (error) {
        setToast({
        message: `Error al guardar la carta`,
        type: "error",
        });
    }
    };

    const filteredCards = cards.filter((card) => {
        const matchesCategory =
        filterCategory === "Todas" || card.rareza === filterCategory;
        const matchesSearch = card.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                        {/* Search */}
                        <div className="relative flex-1 w-full md:max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Buscar cartas por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground"
                        />
                        </div>

                        {/* Add Button */}
                        <button
                        onClick={() => setShowForm(true)}
                        className="w-full md:w-auto px-6 py-3 bg-black border-2 border-black text-white rounded-lg font-black hover:bg-gray-900 hover:border-gray-900 transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                        >
                        <Plus size={20} />
                        AGREGAR CARTA
                        </button>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <button
                            key={cat.id}
                            onClick={() => setFilterCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                                filterCategory === cat.id
                                ? `${cat.color} text-white shadow-lg`
                                : "bg-muted text-muted-foreground hover:bg-card border-2 border-border"
                            }`}
                            >
                            <Icon size={16} />
                            {cat.label}
                            </button>
                        );
                        })}
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCards.map((card) => {
                        const CategoryIcon = getCategoryIcon(card.rareza);
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
                            <div
                                className={`absolute top-2 right-2 ${getCategoryColor(card.rareza)} text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg`}
                            >
                                <CategoryIcon size={14} />
                                {card.rareza.toUpperCase()}
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

                    {/* Empty State */}
                    {filteredCards.length === 0 && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-foreground">
                        No se encontraron cartas
                        </h3>
                        <p className="text-muted-foreground">
                        Intenta cambiar los filtros o agregar una nueva carta
                        </p>
                    </div>
                    )}
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
                        onChange={(e) => {
                            const val = e.target.value;
                            setForm({ ...formData, temporada: val === "" ? "" : Number(val) });
                        }}
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
                        onChange={(e) => {
                            const val = e.target.value;
                            setForm({ ...formData, numero: val === "" ? "" : Number(val) });
                        }}
                        placeholder="Ej. 2"
                        className="w-full px-4 py-3 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            Rareza *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                        {categories.slice(1).map((cat) => {
                            const Icon = cat.icon;
                            return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() =>
                                setForm({ ...formData, rareza: cat.id })
                                }
                                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                                formData.rareza === cat.id
                                    ? `${cat.color} border-transparent text-white shadow-lg`
                                    : "bg-muted border-border text-muted-foreground hover:border-vcf-orange"
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-bold">{cat.label}</span>
                            </button>
                            );
                        })}
                        </div>
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
            {/* Toast Notifications */}
            {toast && (
                <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}