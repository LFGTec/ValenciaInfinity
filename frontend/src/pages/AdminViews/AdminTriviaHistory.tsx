import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Eye, X } from "lucide-react";
import {
  getAdminQuestionsByTriviaId,
  getAdminTrivias,
  type AdminTrivia,
} from "@/services/adminTriviasService";
import type { TriviaQuestion } from "@/services/triviasService";

type StatusFilter = "all" | "active" | "inactive" | "draft" | "expired";

type AdminTriviaHistoryProps = {
  onClose: () => void;
};

export function AdminTriviaHistory({ onClose }: AdminTriviaHistoryProps) {
  const [trivias, setTrivias] = useState<AdminTrivia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedTrivia, setSelectedTrivia] = useState<AdminTrivia | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<TriviaQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    loadAdminTrivias();
  }, []);

  const loadAdminTrivias = async () => {
    setLoading(true);
    const data = await getAdminTrivias();
    setTrivias(data);
    setLoading(false);
  };

  const filteredTrivias = useMemo(() => {
    return trivias.filter((trivia) => {
      const title = trivia.title?.toLowerCase() ?? "";
      const category = trivia.category?.toLowerCase() ?? "";
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        title.includes(search) || category.includes(search);

      const matchesStatus =
        statusFilter === "all" || trivia.computedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [trivias, searchTerm, statusFilter]);

  const handleOpenQuestions = async (trivia: AdminTrivia) => {
    setSelectedTrivia(trivia);
    setLoadingQuestions(true);

    const questions = await getAdminQuestionsByTriviaId(trivia.id);

    setSelectedQuestions(questions);
    setLoadingQuestions(false);
  };

  const getStatusLabel = (status: AdminTrivia["computedStatus"]) => {
    const labels = {
      active: "Activa",
      inactive: "Inactiva",
      draft: "Borrador",
      expired: "Expirada",
    };

    return labels[status];
  };

  const getStatusClass = (status: AdminTrivia["computedStatus"]) => {
    const classes = {
      active: "bg-green-100 text-green-700 border-green-300",
      inactive: "bg-gray-100 text-gray-700 border-gray-300",
      draft: "bg-yellow-100 text-yellow-700 border-yellow-300",
      expired: "bg-red-100 text-red-700 border-red-300",
    };

    return classes[status];
  };

  return (
    <section className="mb-8 rounded-lg border-2 border-gray-200 bg-white shadow-md">
      <div className="flex flex-col gap-4 border-b border-gray-200 p-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-black text-black">
            HISTORIAL DE <span className="text-vcf-orange">TRIVIAS</span>
          </h2>

          <p className="mt-2 text-gray-600">
            Consulta todas las trivias y quizzes existentes desde el panel de administración.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-black text-black hover:bg-gray-200"
        >
          <X size={18} />
          Cerrar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre o categoría..."
            className="w-full rounded-lg border-2 border-gray-200 py-3 pl-12 pr-4 font-bold text-black outline-none focus:border-vcf-orange"
          />
        </div>

        <div className="relative">
          <Filter
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="w-full rounded-lg border-2 border-gray-200 py-3 pl-12 pr-4 font-bold text-black outline-none focus:border-vcf-orange"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
            <option value="draft">Borradores</option>
            <option value="expired">Expiradas</option>
          </select>
        </div>
      </div>

      <div className="px-6 pb-6">
        {loading ? (
          <div className="rounded-lg bg-gray-100 p-6 text-center font-bold text-gray-600">
            Cargando historial de trivias...
          </div>
        ) : filteredTrivias.length === 0 ? (
          <div className="rounded-lg bg-gray-100 p-6 text-center font-bold text-gray-600">
            No se encontraron trivias con los filtros seleccionados.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrivias.map((trivia) => (
              <article
                key={trivia.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-black">
                      {trivia.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {trivia.description || "Sin descripción"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                      <span className="rounded-full bg-vcf-orange px-3 py-1 text-white">
                        Tipo: Trivia
                      </span>

                      <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-700">
                        Categoría: {trivia.category || "Sin categoría"}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 ${getStatusClass(
                          trivia.computedStatus
                        )}`}
                      >
                        Estado: {getStatusLabel(trivia.computedStatus)}
                      </span>

                      <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-700">
                        Preguntas: {trivia.realQuestionCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 lg:items-end">
                    <p className="text-sm font-bold text-gray-600">
                      Creada:{" "}
                      {trivia.created_at
                        ? new Date(trivia.created_at).toLocaleDateString()
                        : "Sin fecha"}
                    </p>

                    <p className="text-sm font-bold text-gray-600">
                      Expira:{" "}
                      {trivia.expires_at
                        ? new Date(trivia.expires_at).toLocaleDateString()
                        : "Sin fecha"}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleOpenQuestions(trivia)}
                      className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 font-black text-white transition-all hover:bg-vcf-orange"
                    >
                      <Eye size={18} />
                      Ver preguntas
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedTrivia && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-black">
                  PREGUNTAS DE{" "}
                  <span className="text-vcf-orange">
                    {selectedTrivia.title}
                  </span>
                </h2>

                <p className="mt-2 text-gray-600">
                  Revisión de preguntas registradas para esta trivia.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedTrivia(null);
                  setSelectedQuestions([]);
                }}
                className="rounded-lg bg-gray-100 px-4 py-2 font-black text-black hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>

            {loadingQuestions ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 font-bold text-gray-600">
                Cargando preguntas...
              </div>
            ) : selectedQuestions.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 font-bold text-gray-600">
                Esta trivia no tiene preguntas registradas.
              </div>
            ) : (
              <div className="space-y-4">
                {selectedQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <p className="text-sm font-black text-vcf-orange">
                      Pregunta {index + 1}
                    </p>

                    <p className="mt-1 text-lg font-black text-black">
                      {question.question}
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`rounded-lg border px-4 py-2 text-sm font-bold ${
                            optionIndex === question.correct_answer
                              ? "border-green-300 bg-green-100 text-green-700"
                              : "border-gray-200 bg-white text-gray-700"
                          }`}
                        >
                          {optionIndex + 1}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}