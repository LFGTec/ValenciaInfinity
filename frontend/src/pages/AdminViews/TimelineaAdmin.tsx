import { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  createTimelineEvent,
  deleteTimelineEvent,
  getTimelineEvents,
  uploadTimelineImage,
  updateTimelineEvent,
  type TimelineEvent,
} from "../../services/timelineService";
import { Toast } from "@/components/ui.disabled/Toast";

export function TimelineAdmin() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
eventId: TimelineEvent["id"] | null;
    eventTitle: string | null;
  }>({
    open: false,
    eventId: null,
    eventTitle: null,
  });

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadEvents();
  }, []);

  const sortedEvents = [...events].sort((a, b) => a.year - b.year);

  const oldestYear = sortedEvents[0]?.year || "-";
  const newestYear = sortedEvents[sortedEvents.length - 1]?.year || "-";

  const loadEvents = async () => {
    setLoading(true);
    const data = await getTimelineEvents();
    setEvents(data);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      description: "",
    });

    setImageFile(null);
    setImagePreview("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setView("list");
    setEditingEvent(null);
    resetForm();
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);

    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
    });

    setImagePreview(event.image_url || "");
    setImageFile(null);

    setView("edit");
  };

  const handleSaveEvent = async () => {
    if (!formData.title.trim()) {
      setToast({
        message: "El título del acontecimiento es obligatorio",
        type: "error",
      });
      return;
    }

    if (!formData.date.trim()) {
      setToast({
        message: "La fecha del acontecimiento es obligatoria",
        type: "error",
      });
      return;
    }

    if (!formData.description.trim()) {
      setToast({
        message: "La descripción del acontecimiento es obligatoria",
        type: "error",
      });
      return;
    }

    try {
      setSaving(true);

      let imageUrl: string | null = editingEvent?.image_url || null;

      if (imageFile) {
        imageUrl = await uploadTimelineImage(imageFile);
      }

      const eventYear = new Date(formData.date).getFullYear();

      const eventPayload = {
        title: formData.title,
        date: formData.date,
        year: eventYear,
        description: formData.description,
        image_url: imageUrl,
      };

      if (view === "edit" && editingEvent) {
        await updateTimelineEvent(editingEvent.id, eventPayload);

        setToast({
          message: "Acontecimiento actualizado correctamente",
          type: "success",
        });
      } else {
        await createTimelineEvent(eventPayload);

        setToast({
          message: "Acontecimiento creado correctamente",
          type: "success",
        });
      }

      await loadEvents();

      resetForm();
      setEditingEvent(null);
      setView("list");
    } catch (error) {
      setToast({
        message: "Error guardando el acontecimiento",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = (event: TimelineEvent) => {
    setConfirmDelete({
      open: true,
      eventId: event.id,
      eventTitle: event.title,
    });
  };

  const confirmDeleteEvent = async () => {
    if (!confirmDelete.eventId) return;

    try {
      await deleteTimelineEvent(confirmDelete.eventId);

      setEvents((prev) =>
        prev.filter((event) => event.id !== confirmDelete.eventId)
      );

      setToast({
        message: `Acontecimiento "${confirmDelete.eventTitle}" eliminado`,
        type: "success",
      });
    } catch {
      setToast({
        message: "No se pudo eliminar el acontecimiento",
        type: "error",
      });
    } finally {
      setConfirmDelete({
        open: false,
        eventId: null,
        eventTitle: null,
      });
    }
  };

  if (view === "create" || view === "edit") {
    return (
      <div className="min-h-screen bg-white px-4 py-10 text-[#111111] md:px-8">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-[#ff6a00]">
                Panel administrador
              </p>

              <h1 className="mb-2 text-3xl font-black uppercase text-[#111111] md:text-5xl">
                {view === "edit" ? "Editar" : "Crear"}{" "}
                <span className="text-[#ff6a00]">Acontecimiento</span>
              </h1>

              <p className="text-sm text-gray-500 md:text-base">
                {view === "edit"
                  ? "Modifica la información del acontecimiento seleccionado."
                  : "Nuevo acontecimiento para la línea del tiempo."}
              </p>
            </div>

            <button
              onClick={handleCancel}
              className="rounded-xl bg-gray-100 px-6 py-3 text-sm font-black text-[#111111] transition hover:bg-gray-200"
            >
              ← Volver
            </button>
          </div>

          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-black uppercase text-[#111111]">
              Información{" "}
              <span className="text-[#ff6a00]">del Acontecimiento</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-black text-[#111111]">
                  Título *
                </label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-[#111111] outline-none transition focus:border-[#ff6a00] focus:bg-white"
                  placeholder="Ej: Copa del Rey 2024"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#111111]">
                  Fecha *
                </label>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-[#111111] outline-none transition focus:border-[#ff6a00] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#111111]">
                  Descripción *
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-[#111111] outline-none transition focus:border-[#ff6a00] focus:bg-white"
                  placeholder="Describe el acontecimiento..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-[#111111]">
                  Imagen opcional
                </label>

                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="timeline-image-upload"
                      className="hidden"
                    />

                    <label
                      htmlFor="timeline-image-upload"
                      className="flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-[#ff6a00] hover:bg-orange-50"
                    >
                      <Upload size={48} className="mb-3 text-[#ff6a00]" />

                      <p className="mb-2 text-sm font-black text-[#111111]">
                        <span className="text-[#ff6a00]">
                          Haz clic para subir
                        </span>{" "}
                        una imagen
                      </p>

                      <p className="text-xs text-gray-500">
                        PNG, JPG o GIF
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative h-72 w-full overflow-hidden rounded-xl border-2 border-[#ff6a00] bg-gray-100 shadow-lg">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />

                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-black text-white shadow-lg transition hover:bg-red-600"
                    >
                      <X size={18} />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleSaveEvent}
              disabled={saving}
              className="flex-1 rounded-xl bg-[#ff6a00] py-4 text-lg font-black uppercase text-white shadow-lg transition hover:bg-[#e05516] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Guardando..."
                : view === "edit"
                  ? "Guardar Cambios"
                  : "Crear Acontecimiento"}
            </button>

            <button
              onClick={handleCancel}
              className="rounded-xl bg-gray-100 px-8 py-4 text-sm font-black uppercase text-[#111111] transition hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 text-[#111111] md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.3em] text-[#ff6a00]">
              Panel administrador
            </p>

            <h1 className="mb-2 text-3xl font-black uppercase text-[#111111] md:text-5xl">
              Gestionar{" "}
              <span className="text-[#ff6a00]">Línea del Tiempo</span>
            </h1>

            <p className="text-sm text-gray-500 md:text-base">
              Administra los acontecimientos históricos del club.
            </p>
          </div>

          <button
            onClick={() => setView("create")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#ff6a00] px-6 py-3 text-sm font-black uppercase text-white shadow-md transition hover:bg-[#e05516]"
          >
            <Plus size={18} />
            Crear acontecimiento
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              label: "Total Acontecimientos",
              value: events.length,
              icon: Calendar,
              color: "bg-[#ff6a00]",
            },
            {
              label: "Más Antiguo",
              value: oldestYear,
              icon: Clock,
              color: "bg-[#111111]",
            },
            {
              label: "Más Reciente",
              value: newestYear,
              icon: TrendingUp,
              color: "bg-[#ff6a00]",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon size={24} className="text-white" />
                </div>

                <div className="text-4xl font-black text-[#111111]">
                  {stat.value}
                </div>
              </div>

              <div className="text-sm font-black text-gray-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="border-b border-gray-200 bg-gray-50 p-6">
            <h2 className="text-2xl font-black uppercase text-[#111111]">
              Lista de <span className="text-[#ff6a00]">Acontecimientos</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm font-bold text-gray-500">
              Cargando acontecimientos...
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-xl font-black text-[#111111]">
                Todavía no hay acontecimientos
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Crea el primer acontecimiento para mostrarlo en la página de
                fans.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedEvents.map((event) => (
                <div key={event.id} className="p-6 transition hover:bg-gray-50">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    {event.image_url && (
                      <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 shadow-md md:w-32">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black text-[#111111]">
                          {event.title}
                        </h3>

                        <span className="rounded-full bg-[#ff6a00] px-3 py-1 text-xs font-black text-white">
                          {event.year}
                        </span>
                      </div>

                      <p className="mb-2 flex items-center gap-2 text-sm font-bold text-[#ff6a00]">
                        <Calendar size={16} />
                        {event.date}
                      </p>

                      <p className="max-w-4xl text-sm leading-relaxed text-gray-600">
                        {event.description}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="rounded-lg bg-[#ff6a00] px-4 py-3 font-bold text-white transition hover:bg-[#e05516]"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(event)}
                        className="rounded-lg bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
              ¿Eliminar acontecimiento?
            </h2>

            <p className="text-muted-foreground mb-6">
              Estás a punto de eliminar{" "}
              <span className="font-bold">
                "{confirmDelete.eventTitle}"
              </span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setConfirmDelete({
                    open: false,
                    eventId: null,
                    eventTitle: null,
                  })
                }
                className="flex-1 px-4 py-2 bg-muted rounded-lg font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDeleteEvent}
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