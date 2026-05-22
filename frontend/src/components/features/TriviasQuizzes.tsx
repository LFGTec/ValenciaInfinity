import { useEffect, useState } from "react";
import {
  Gamepad2,
  Clock,
  Trophy,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";

import {
  getTrivias,
  getQuestionsByTriviaId,
  type Trivia,
  type TriviaQuestion,
} from "../../services/triviasService";
import { useAuth } from "../../hooks/useAuth";

import { addTriviaRewardToCurrentUser } from "@/services/rewardsService";

export function TriviasQuizzes() {
  const { user, updatePoints } = useAuth();

  const [activeTab, setActiveTab] = useState<"active" | "leaderboard">(
    "active"
  );
  const [activeTrivias, setActiveTrivias] = useState<Trivia[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  const [completedTriviaIds, setCompletedTriviaIds] = useState<string[]>([]);

  const [selectedTrivia, setSelectedTrivia] = useState<Trivia | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<TriviaQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    const savedCompletedTrivias = localStorage.getItem("completedTrivias");

    if (savedCompletedTrivias) {
      setCompletedTriviaIds(JSON.parse(savedCompletedTrivias));
    }
  }, []);

  useEffect(() => {
    const fetchTrivias = async () => {
      setLoading(true);
      const data = await getTrivias();
      setActiveTrivias(data);
      setLoading(false);
    };

    fetchTrivias();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const difficultyColors = {
    easy: "bg-green-500",
    medium: "bg-vcf-orange",
    hard: "bg-red-600",
  };

  const difficultyLabels = {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
  };

  const getCountdown = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();

    if (diff <= 0) return "Expirada";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  const resetQuiz = () => {
    setSelectedTrivia(null);
    setQuizQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setEarnedPoints(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  const handleStartTrivia = async (trivia: Trivia) => {
    if (completedTriviaIds.includes(trivia.id)) {
      return;
    }

    setSelectedTrivia(trivia);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setQuizComplete(false);
    setSelectedAnswer(null);
    setQuestionsLoading(true);

    const preguntas = await getQuestionsByTriviaId(trivia.id);

    setQuizQuestions(preguntas);
    setQuestionsLoading(false);
  };

  const saveCompletedTrivia = (triviaId: string) => {
    if (completedTriviaIds.includes(triviaId)) return;

    const updatedCompletedTrivias = [...completedTriviaIds, triviaId];

    setCompletedTriviaIds(updatedCompletedTrivias);

    localStorage.setItem(
      "completedTrivias",
      JSON.stringify(updatedCompletedTrivias)
    );
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    const currentQ = quizQuestions[currentQuestion];

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQ.correct_answer;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
    }

    setTimeout(async () => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        if (selectedTrivia) {
          const percentage = Math.round(
            (newScore / quizQuestions.length) * 100
          );

          const points = Math.round(
            (percentage / 100) * selectedTrivia.reward
          );

          setEarnedPoints(points);

          await addTriviaRewardToCurrentUser({
            triviaId: selectedTrivia.id,
            score: newScore,
            totalQuestions: quizQuestions.length,
            earnedPoints: points,
          });

          saveCompletedTrivia(selectedTrivia.id);

          if (user && points > 0) {
            updatePoints(points);
          }
        }

        setQuizComplete(true);
      }
    }, 2000);
  };

  if (quizComplete && selectedTrivia) {
    const percentage = Math.round((score / quizQuestions.length) * 100);

    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-card border-2 border-vcf-orange rounded-xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-vcf-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy size={48} className="text-white" />
            </div>

            <h2 className="text-4xl font-black mb-4 text-foreground">
              ¡QUIZ <span className="text-vcf-orange">COMPLETADO</span>!
            </h2>

            <div className="bg-muted rounded-lg p-6 mb-6">
              <div className="text-6xl font-black mb-2 text-vcf-orange">
                {percentage}%
              </div>

              <div className="text-xl text-muted-foreground mb-4">
                {score} de {quizQuestions.length} respuestas correctas
              </div>

              <div className="flex items-center justify-center gap-2 text-2xl font-black text-foreground">
                <Award className="text-vcf-orange" size={32} />
                <span>+{earnedPoints} PUNTOS</span>
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="w-full py-4 bg-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] transition-colors shadow-lg"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTrivia && questionsLoading) {
    return (
      <div className="min-h-screen bg-content py-12 flex items-center justify-center">
        <p className="text-xl font-black text-foreground">
          Cargando preguntas...
        </p>
      </div>
    );
  }

  if (selectedTrivia && quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-content py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-black text-foreground mb-4">
            Esta trivia todavía no tiene preguntas.
          </p>

          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] transition-colors"
          >
            VOLVER
          </button>
        </div>
      </div>
    );
  }

  if (selectedTrivia) {
    const currentQ = quizQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-content py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-black text-white border-2 border-black rounded-lg hover:bg-vcf-orange hover:border-vcf-orange transition-colors font-bold"
            >
              ← VOLVER A TRIVIAS
            </button>
          </div>

          <div className="bg-card border-2 border-vcf-orange rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-foreground mb-1">
                  {selectedTrivia.title}
                </h2>

                <p className="text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {quizQuestions.length}
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-vcf-orange">
                  {score}
                </div>

                <div className="text-sm text-muted-foreground font-bold">
                  Correctas
                </div>
              </div>
            </div>

            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-vcf-orange transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 mb-6 shadow-lg border-2 border-border">
            <h3 className="text-2xl font-black mb-8 text-foreground">
              {currentQ.question}
            </h3>

            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-6 text-left rounded-lg border-2 font-bold transition-all ${
                    selectedAnswer === null
                      ? "border-border bg-card hover:border-vcf-orange hover:bg-muted text-foreground"
                      : selectedAnswer === index
                        ? index === currentQ.correct_answer
                          ? "border-green-500 bg-green-100 text-black"
                          : "border-red-500 bg-red-100 text-black"
                        : index === currentQ.correct_answer
                          ? "border-green-500 bg-green-100 text-black"
                          : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span>{option}</span>

                    {showResult && index === currentQ.correct_answer && (
                      <CheckCircle className="text-green-600" size={24} />
                    )}

                    {showResult &&
                      selectedAnswer === index &&
                      index !== currentQ.correct_answer && (
                        <XCircle className="text-red-500" size={24} />
                      )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="w-full py-4 bg-red-600 text-white rounded-lg font-black hover:bg-red-700 transition-colors shadow-lg"
          >
            ABANDONAR QUIZ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-content">
      <div className="mb-6">
        <h1 className="text-5xl font-black mb-4 text-foreground">
          TRIVIAS & <span className="text-vcf-orange">QUIZZES</span>
        </h1>

        <p className="text-xl text-muted-foreground">
          Demuestra tus conocimientos y gana recompensas
        </p>
      </div>

      <div className="flex gap-2 mb-8 border-b-2 border-border">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-3 font-black transition-all text-base ${
            activeTab === "active"
              ? "border-b-4 border-vcf-orange text-vcf-orange"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          DESAFÍOS ACTIVOS
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-6 py-3 font-black transition-all text-base ${
            activeTab === "leaderboard"
              ? "border-b-4 border-vcf-orange text-vcf-orange"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          CLASIFICACIÓN
        </button>
      </div>

      {activeTab === "active" && (
        <>
          {loading && (
            <p className="text-muted-foreground font-bold">
              Cargando trivias...
            </p>
          )}

          {!loading && activeTrivias.length === 0 && (
            <p className="text-muted-foreground font-bold">
              No hay trivias activas por ahora.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {activeTrivias.map((trivia) => {
              const isCompleted = completedTriviaIds.includes(trivia.id);

              return (
                <div
                  key={trivia.id}
                  className={`bg-card border-2 rounded-xl p-8 transition-all shadow-md ${
                    isCompleted
                      ? "border-green-500 opacity-80"
                      : "border-border hover:border-vcf-orange hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md ${
                          isCompleted ? "bg-green-500" : "bg-vcf-orange"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={24} className="text-white" />
                        ) : (
                          <Gamepad2 size={24} className="text-white" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-black text-xl mb-1 text-foreground">
                          {trivia.title}
                        </h3>

                        <span className="inline-block bg-black text-white px-2 py-1 rounded text-sm font-black">
                          {trivia.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`${difficultyColors[trivia.difficulty]} text-white px-3 py-1 rounded-full text-sm font-black shadow-md`}
                    >
                      {difficultyLabels[trivia.difficulty]}
                    </span>
                  </div>

                  <p className="text-base text-muted-foreground mb-6">
                    {trivia.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted rounded-lg shadow-sm">
                      <div className="text-2xl font-black mb-1 text-black">
                        {trivia.questions}
                      </div>

                      <div className="text-sm text-muted-foreground font-bold">
                        Preguntas
                      </div>
                    </div>

                    <div className="text-center p-3 bg-muted rounded-lg shadow-sm">
                      <div className="text-2xl font-black mb-1 text-vcf-orange">
                        +{trivia.reward}
                      </div>

                      <div className="text-sm text-muted-foreground font-bold">
                        Puntos
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-base text-muted-foreground mb-6">
                    <Clock size={16} className="text-vcf-orange" />
                    <span>Termina en {getCountdown(trivia.expires_at)}</span>
                  </div>

                  {isCompleted ? (
                    <button
                      disabled
                      className="px-6 md:px-8 py-3 md:py-4 bg-gray-300 border-2 border-gray-300 text-gray-700 rounded-lg font-black cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base w-full"
                    >
                      <CheckCircle size={20} />
                      QUIZ COMPLETADO
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartTrivia(trivia)}
                      className="px-6 md:px-8 py-3 md:py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base w-full"
                    >
                      COMENZAR QUIZ
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === "leaderboard" && (
        <div>
          <h2 className="text-3xl font-black mb-6 text-foreground">
            CLASIFICACIÓN
          </h2>

          <p className="text-muted-foreground font-bold">
            Aquí después puedes conectar tu ranking real.
          </p>
        </div>
      )}
    </div>
  );
}