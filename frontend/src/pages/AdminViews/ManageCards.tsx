import { useState } from "react";
import {
  Plus,
  Search,
  X,
  Upload,
  Star,
  Trash2,
} from "lucide-react";
import { Toast } from "@/components/ui.disabled/Toast";
import { useCards } from "../../hooks/useCards";
import { iconMap } from "@/utils/IconMap";
import { colorMap } from "@/utils/colorMap";
import type { Card } from "../../services/cardsService";

export function ManageCards(){
    const [showForm, setShowForm] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    cardId: string | null;
    cardName: string | null;
    }>({
    open: false,
    cardId: null,
    cardName: null,
    });

    const {
    cards,
    categories,
    createCard,
    removeCard,
    editCard,
    } = useCards();

    const allCategories = [
    {
        id: "ALL",
        label: "Todas",
        color: "bg-black",
        icon: "Filter",
    },
    ...categories,
    ];

    const [formData, setForm] = useState({
    name: "",
    type: "",
    season: "" as any,
    category_id: "",
    });

    const resetForm = () => {
    setForm({
        name: "",
        type: "",
        season: "",
        category_id: "",
    });

    setFile(null);
    setImagePreview(null);
    };

    const [fileUpload, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
        setToast({ message: "Nombre obligatorio", type: "error" });
        return;
    }

    try {
        if (editingCard) {
        await editCard(
          editingCard.id,
          formData.name,
          formData.type,
          Number(formData.season),
          formData.category_id,
          editingCard.image_url || null,
          fileUpload || undefined
        );

        setToast({
            message: "Carta actualizada",
            type: "success",
        });
        } else {
        await createCard(
            formData.name,
            formData.type,
            Number(formData.season),
            formData.category_id,
            fileUpload || undefined
        );

        setToast({
            message: "Carta creada",
            type: "success",
        });
        }

        // reset
        resetForm();
        setEditingCard(null);
        setShowForm(false);
    } catch {
        setToast({
        message: "Error al guardar",
        type: "error",
        });
    }
    };

    const handleEdit = (card: Card) => {
    setEditingCard(card);

    setForm({
        name: card.name,
        type: card.type || "",
        season: card.season || "",
        category_id: card.category_id,
    });

    setImagePreview(card.image_url || null);
    setFile(null);

    setShowForm(true);
    };
    

    // Eliminar carta
    const confirmDeleteCard = async () => {
    if (!confirmDelete.cardId) return;

    try {
        await removeCard(confirmDelete.cardId);

        setToast({
        message: `Carta "${confirmDelete.cardName}" eliminada`,
        type: "success",
        });
    } catch {
        setToast({
        message: "Error al eliminar",
        type: "error",
        });
    } finally {
        setConfirmDelete({
        open: false,
        cardId: null,
        cardName: null,
        });
    }
    };

    // Filtrado y búsqueda
    const filteredCards = cards.filter((card) => {
    const matchesCategory =
        filterCategory === "ALL" ||
        card.category_id === filterCategory;

    const matchesSearch = card.name
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
                        {allCategories.map((cat) => {
                        const Icon = iconMap[ "Star"];
                        return (
                            <button
                            key={cat.id}
                            onClick={() => setFilterCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                                filterCategory === cat.id
                                ? `${colorMap[cat.color] || "bg-gray-400"} text-white shadow-lg`
                                : "bg-muted text-muted-foreground hover:bg-card border-2 border-border"
                            }`}
                            >
                            <Icon size={16} />
                            {Icon}
                            </button>
                        );
                        })}
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCards.map((card) => {
                    const CategoryIcon = iconMap[ "Star"];

                    return (
                        <div key={card.id} className="bg-card border-2 rounded-lg">
                        
                        {/* Imagen */}
                        <div className="relative aspect-[2/3]">
                            <img
                            src={card.image_url || "/placeholder.png"}
                            alt={card.name}
                            className="w-full h-full object-cover"
                            />

                            {/* Badge */}
                            <div
                            className={`absolute top-2 right-2 ${
                                colorMap[card.categories?.color || ""] || "bg-gray-400"
                            } text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1`}
                            >
                            <CategoryIcon size={14} />
                            {( card.rarity)?.toUpperCase()}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <h3 className="font-black text-lg">{card.name}</h3>

                            <p className="text-sm text-muted-foreground mb-1">
                                <span className="font-bold">Tipo:</span> {card.type}
                            </p>

                            <p className="text-sm text-muted-foreground mb-3">
                                <span className="font-bold">Temporada:</span> {card.season}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2 mt-3">
                            <button className="flex-1 px-3 py-2 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] transition-all"
                            onClick={() => {handleEdit(card)}}>
                                Editar
                            </button>

                            <button
                                onClick={() =>
                                setConfirmDelete({
                                    open: true,
                                    cardId: card.id,
                                    cardName: card.name,
                                })
                                }
                                className="px-3 py-2 bg-black border-2 border-black text-white rounded-lg font-bold hover:bg-gray-900 hover:border-gray-900 transition-all flex items-center justify-center"
                            >
                                <Trash2 size={16} />
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
                        {editingCard ? "EDITAR " : "AGREGAR NUEVA" } <span className="text-vcf-orange">CARTA</span>
                    </h2>
                    <button
                        onClick={() => {setShowForm(false);  setEditingCard(null); resetForm();}}
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
                        value={formData.name}
                        onChange={(e) =>
                            setForm({ ...formData, name: e.target.value })
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
                        value={formData.type}
                        onChange={(e) =>
                            setForm({ ...formData, type: e.target.value })
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
                        value={formData.season}
                        onChange={(e) => {
                            const val = e.target.value;
                            setForm({ ...formData, season: val === "" ? "" : Number(val) });
                        }}
                        placeholder="Ej. 2026"
                        className="w-full px-4 py-3 bg-muted border-2 border-transparent rounded-lg focus:border-vcf-orange outline-none transition-all text-foreground"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            Rareza *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => {
                        const Icon = iconMap[ "Star"];

                        return (
                            <button
                            key={cat.id}
                            type="button"
                            onClick={() =>
                                setForm({ ...formData, category_id: cat.id })
                            }
                            className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                                formData.category_id === cat.id
                                ? `${cat.color} text-white`
                                : "bg-muted"
                            }`}
                            >
                            <Icon size={20} />
                            <span>{Icon}</span>
                            </button>
                        );
                        })}
                        </div>
                    </div>

                    {/* Si Editando, mostrar preview de imagen actual */}
                    {imagePreview && (
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">
                                Imagen Actual
                            </label>
                            <div className="center mb-2">
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    className="w-32 h-48 object-cover rounded mb-2"
                                />
                            </div>
                        </div>
                    )}
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
                        onClick={() =>{setShowForm(false);   setEditingCard(null); resetForm();}}
                        className="flex-1 px-6 py-3 bg-muted border-2 border-border text-foreground rounded-lg font-bold hover:bg-card transition-all"
                        >
                        CANCELAR
                        </button>
                        <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-black border-2 border-black text-white rounded-lg font-bold hover:bg-gray-900 hover:border-gray-900 transition-all shadow-md hover:shadow-lg hover:scale-105"
                        >
                        {editingCard ? "GUARDAR CAMBIOS" : "AGREGAR CARTA"}
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

            {confirmDelete.open && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-card p-6 rounded-lg border-2 border-border max-w-sm w-full">
                <h2 className="text-xl font-black mb-4">
                    ¿Eliminar carta?
                </h2>

                <p className="text-muted-foreground mb-6">
                    Estás a punto de eliminar{" "}
                    <span className="font-bold">
                    "{confirmDelete.cardName}"
                    </span>
                </p>

                <div className="flex gap-3">
                    <button
                    onClick={() =>
                        setConfirmDelete({
                        open: false,
                        cardId: null,
                        cardName: null,
                        })
                    }
                    className="flex-1 px-4 py-2 bg-muted rounded-lg font-bold"
                    >
                    Cancelar
                    </button>

                    <button
                    onClick={confirmDeleteCard}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                    >
                    Eliminar
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
    );
}