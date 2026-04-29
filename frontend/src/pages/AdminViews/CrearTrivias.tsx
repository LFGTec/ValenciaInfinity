import  { useEffect, useState } from "react";
import {
  Gamepad2,
  TrendingUp,
  FileText,
  Upload,
  X,
} from "lucide-react";

import {
  getTrivias,
  createTrivia,
  deleteTrivia,
  deleteExpiredTrivias,
  createTriviaQuestions,
  uploadTriviaImage,
  getQuestionsByTriviaId,
  updateTrivia,
  type Trivia,
} from "../../services/triviasService";
import { supabase } from "@/services/supabaseClient";

export function CrearTrivias() {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [trivias, setTrivias] = useState<Trivia[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");


  useEffect(() => {
  const cargarTrivias = async () => {
    setLoading(true);

    const data = await getTrivias();

    setTrivias(data);
    setLoading(false);
  };

  cargarTrivias();
}, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    durationValue: 10,
    durationUnit: "minutes" as "minutes" | "hours" | "days",
    reward: 50,
    image: "",
  });


  const [questions, setQuestions] = useState([
    {
      id: "1",
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
    },
  ]);

  useEffect(() => {
    loadTrivias();
  }, []);

useEffect(() => {
  const interval = setInterval(async () => {
    setNow(Date.now());

    const expiredTrivias = trivias.filter(
      (trivia) => new Date(trivia.expires_at).getTime() <= now
    );

    if (expiredTrivias.length > 0) {
      await deleteExpiredTrivias();

      setTrivias((prev) =>
        prev.filter(
          (trivia) => new Date(trivia.expires_at).getTime() > Date.now()
        )
      );
    }
  }, 1000);

  return () => clearInterval(interval);
}, [trivias]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadTrivias = async () => {
    const data = await getTrivias();
    setTrivias(data);
  };

  const getExpirationDate = () => {
    const expiresAt = new Date();

    if (formData.durationUnit === "minutes") {
      expiresAt.setMinutes(expiresAt.getMinutes() + formData.durationValue);
    }

    if (formData.durationUnit === "hours") {
      expiresAt.setHours(expiresAt.getHours() + formData.durationValue);
    }

    if (formData.durationUnit === "days") {
      expiresAt.setDate(expiresAt.getDate() + formData.durationValue);
    }

    return expiresAt.toISOString();
  };

  const getCountdown = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - now;

    if (diff <= 0) return "Expirada";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const difficultyColors = {
    easy: "bg-green-500",
    medium: "bg-vcf-orange",
    hard: "bg-red-600",
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      difficulty: "easy",
      durationValue: 10,
      durationUnit: "minutes",
      reward: 0,
      image: "",
    });

    setQuestions([]);
    setImagePreview("");
    setEditingId(null);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: String(questions.length + 1),
        question: "",
        options: ["", "", "", ""],
        correct_answer: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];

    if (field === "question") {
      newQuestions[index].question = value;
    }

    if (field === "correct_answer") {
      newQuestions[index].correct_answer = value;
    }

    setQuestions(newQuestions);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };


const handleSaveTrivia = async () => {
  try {
    setLoading(true);

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      formData.durationValue <= 0
    ) {
      alert("Completa los campos obligatorios");
      return;
    }

    let imageUrl = formData.image || "";

    if (imageFile) {
      const uploadedUrl = await uploadTriviaImage(imageFile);

      console.log("URL subida:", uploadedUrl);

      if (!uploadedUrl) {
        alert("No se pudo subir la imagen");
        return;
      }

      imageUrl = uploadedUrl;
    }

    const triviaData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      expires_at: getExpirationDate(),
      reward: formData.reward,
      questions: questions.length,
      status: "active" as const,
      image_url: imageUrl,
    };

if (view === "edit" && editingId !== null) {
  await updateTrivia(editingId, triviaData);

  const { error: deleteQuestionsError } = await supabase
    .from("trivia_questions")
    .delete()
    .eq("trivia_id", editingId);

  if (deleteQuestionsError) {
    console.error("Error eliminando preguntas anteriores:", deleteQuestionsError);
    alert("Se actualizó la trivia, pero no se pudieron borrar las preguntas anteriores");
    return;
  }

  const preguntasActualizadas = questions.map((q) => ({
    trivia_id: editingId,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
  }));

  const preguntasCreadas = await createTriviaQuestions(preguntasActualizadas);

  if (!preguntasCreadas) {
    alert("Se actualizó la trivia, pero no se pudieron guardar las preguntas nuevas");
    return;
  }

  alert("Trivia actualizada correctamente");
} else {
  const triviaCreada = await createTrivia(triviaData);

  if (!triviaCreada) {
    alert("No se pudo crear la trivia");
    return;
  }

  const preguntasParaSupabase = questions.map((q) => ({
    trivia_id: triviaCreada.id,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
  }));

  const preguntasCreadas = await createTriviaQuestions(preguntasParaSupabase);

  if (!preguntasCreadas) {
    alert("La trivia se creó, pero las preguntas no se guardaron");
    return;
  }

  alert("Trivia creada correctamente");
}

    setEditingId(null);
    setView("list");
    resetForm();
    await loadTrivias();
  } catch (error) {
    console.error("Error guardando trivia:", error);
    alert("No se pudo guardar la trivia");
  } finally {
    setLoading(false);
  }
};

  const handleDeleteTrivia = async (id: string) => {
    const success = await deleteTrivia(id);

    if (!success) {
      setMessage("Error al eliminar");
      return;
    }

    setTrivias((prev) => prev.filter((t) => t.id !== id));
    setMessage("Trivia eliminada");
  };

  const handleEditTrivia = async (trivia: Trivia) => {
    setEditingId(trivia.id);

    setFormData({
      title: trivia.title,
      description: trivia.description,
      category: trivia.category,
      difficulty: trivia.difficulty,
      durationValue: 10,
      durationUnit: "minutes",
      reward: trivia.reward,
      image: trivia.image_url || "",
    });

    setImagePreview(trivia.image_url || "");

    const preguntas = await getQuestionsByTriviaId(trivia.id);

      setQuestions(
        preguntas.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
        }))
      );

    setView("edit");
  };

  if (view === "create" || view === "edit") {
    return (
  <div className="bg-white text-black min-h-screen p-6">
            {message && (
          <div className="fixed top-6 right-6 bg-vcf-orange text-white font-bold px-6 py-3 rounded-lg shadow-lg z-50">
            {message}
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2 text-foreground">
              {editingId ? "EDITAR" : "CREAR"}{" "}
              <span className="text-vcf-orange">TRIVIA</span>
            </h1>
            <p className="text-muted-foreground">
              {editingId
                ? "Modifica la trivia existente"
                : "Nueva trivia para los fans"}
            </p>
          </div>

          <button
            onClick={() => {
              setView("list");
              resetForm();
            }}
            className="px-6 py-3 bg-muted text-foreground rounded-lg font-bold hover:bg-border transition-all"
          >
            ← VOLVER
          </button>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-black mb-6 text-foreground">
            INFORMACIÓN <span className="text-vcf-orange">GENERAL</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">
                Título de la Trivia *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-muted border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none"
                placeholder="Ej: Historia del Valencia CF"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">
                Categoría *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 bg-muted border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none"
                placeholder="Ej: Historia, Actualidad, Jugadores"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2 text-foreground">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-muted border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none resize-none"
                placeholder="Describe la trivia..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">
                Dificultad *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as "easy" | "medium" | "hard",
                  })
                }
                className="w-full px-4 py-3 bg-muted border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none"
              >
                <option value="easy">Fácil</option>
                <option value="medium">Medio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">
                Recompensa *
              </label>
              <input
                type="number"
                value={formData.reward}
                onChange={(e) =>
                  setFormData({ ...formData, reward: Number(e.target.value) })
                }
                className="w-full px-4 py-3 bg-muted border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">
                Tiempo límite *
              </label>

              <div className="flex gap-3">
                <input
                  type="number"
                  min={1}
                  value={formData.durationValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationValue: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 bg-muted border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none"
                />

                <select
                  value={formData.durationUnit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationUnit: e.target.value as
                        | "minutes"
                        | "hours"
                        | "days",
                    })
                  }
                  className="w-full px-4 py-3 bg-muted border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none"
                >
                  <option value="minutes">Minutos</option>
                  <option value="hours">Horas</option>
                  <option value="days">Días</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2 text-foreground">
                Imagen de la Trivia
              </label>

              {!imagePreview ? (
                <div className="relative">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 bg-muted border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-vcf-orange hover:bg-card transition-all"
                  >
                    <Upload size={48} className="text-vcf-orange mb-3" />
                    <p className="mb-2 text-sm font-bold text-foreground">
                      <span className="text-vcf-orange">Haz clic para subir</span>{" "}
                      o arrastra y suelta
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG o GIF</p>
                  </label>
                </div>
              ) : (
                <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden border-2 border-vcf-orange shadow-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                      setFormData({ ...formData, image: "" });
                    }}
                    className="absolute top-3 right-3 bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    <X size={18} />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">
              PREGUNTAS{" "}
              <span className="text-vcf-orange">({questions.length})</span>
            </h2>

            <button
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] transition-all shadow-md"
            >
              + AGREGAR PREGUNTA
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="bg-muted border-2 border-border rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-foreground">
                    Pregunta {qIndex + 1}
                  </h3>

                  {questions.length > 1 && (
                    <button
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕ Eliminar
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "question", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-card border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none mb-4"
                  placeholder="Escribe la pregunta..."
                />

                <div className="space-y-3">
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correct_answer === oIndex}
                        onChange={() =>
                          handleQuestionChange(
                            qIndex,
                            "correct_answer",
                            oIndex
                          )
                        }
                        className="w-5 h-5 accent-vcf-orange"
                      />

                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        className="flex-1 px-4 py-3 bg-card border-2 border-border rounded-lg text-foreground font-bold focus:border-vcf-orange focus:outline-none"
                        placeholder={`Opción ${oIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSaveTrivia}
            disabled={loading}
            className="flex-1 py-4 bg-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] transition-all shadow-lg text-lg disabled:opacity-60"
          >
          {loading ? "GUARDANDO..." : "CREAR TRIVIA"}
          </button>

          <button
            onClick={() => {
              setView("list");
              resetForm();
            }}
            className="px-8 py-4 bg-muted text-foreground rounded-lg font-bold hover:bg-border transition-all"
          >
            CANCELAR
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="bg-white text-black min-h-screen p-6">      {message && (
        <div className="fixed top-6 right-6 bg-vcf-orange text-white font-bold px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-blue mb-2 text-foreground">
            GESTIONAR <span className="text-vcf-orange">TRIVIAS</span>
          </h1>
          <p className="text-muted-foreground">
            Administra las trivias y quizzes de la plataforma
          </p>
        </div>

        <button
          onClick={() => setView("create")}
          className="px-6 py-3 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] transition-all shadow-md"
        >
          + CREAR TRIVIA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Total Trivias",
            value: trivias.length,
            icon: Gamepad2,
            color: "bg-vcf-orange",
          },
          {
            label: "Activas",
            value: trivias.filter((t) => t.status === "active").length,
            icon: TrendingUp,
            color: "bg-green-500",
          },
          {
            label: "Preguntas",
            value: trivias.reduce((acc, t) => acc + t.questions, 0),
            icon: FileText,
            color: "bg-vcf-orange",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border-2 border-border rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon size={24} className="text-white" />
              </div>

              <div className="text-4xl font-black text-foreground">
                {stat.value}
              </div>
            </div>

            <div className="text-sm font-bold text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b-2 border-border bg-muted">
          <h2 className="text-2xl font-black text-foreground">
            LISTA DE <span className="text-vcf-orange">TRIVIAS</span>
          </h2>
        </div>

        <div className="divide-y divide-border">
          {trivias.map((trivia) => (
            <div
              key={trivia.id}
              className="p-6 hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between gap-6">
                {trivia.image_url && (
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 border-border shadow-md">
                    <img
                      src={trivia.image_url}
                      alt={trivia.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black text-foreground">
                      {trivia.title}
                    </h3>

                    <span
                      className={`${difficultyColors[trivia.difficulty]} text-white px-3 py-1 rounded-full text-xs font-black`}
                    >
                      {trivia.difficulty === "easy"
                        ? "FÁCIL"
                        : trivia.difficulty === "medium"
                          ? "MEDIO"
                          : "DIFÍCIL"}
                    </span>

                    <span className="bg-gray-200 text-white px-3 py-1 rounded text-xs font-black">
                      {trivia.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {trivia.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-2xl font-black text-foreground">
                        {trivia.questions}
                      </div>
                      <div className="text-xs text-muted-foreground font-bold">
                        Preguntas
                      </div>
                    </div>

                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-2xl font-black text-vcf-orange">
                        +{trivia.reward}
                      </div>
                      <div className="text-xs text-muted-foreground font-bold">
                        Puntos
                      </div>
                    </div>

                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-sm font-black text-foreground">
                        {getCountdown(trivia.expires_at)}
                      </div>
                      <div className="text-xs text-muted-foreground font-bold">
                        Tiempo restante
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-6">
                  <button
                    onClick={() => handleEditTrivia(trivia)}
                    className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#e05516] transition-all"
                  >
                    EDITAR
                  </button>

                  <button
                    onClick={() => handleDeleteTrivia(trivia.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all"
                  >
                    ELIMINAR
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* {trivias.length === 0 ? (
            <p>No hay trivias creadas todavía.</p>
          ) : (
            trivias.map((trivia) => (
              <div key={trivia.id}>
                <h3>{trivia.title}</h3>
                <p>{trivia.description}</p>
              </div>
            ))
          )} */}
        </div>
      </div>
    </div>
  );
}