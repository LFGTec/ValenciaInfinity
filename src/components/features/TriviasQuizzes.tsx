import React, { useState } from "react";
import {
  Gamepad2,
  Clock,
  Users,
  Trophy,
  Star,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import avatar1 from "../../assets/Avatar1.png";
import avatar2 from "../../assets/Avatar2.png";
import avatar3 from "../../assets/Avatar3.png";
import avatar4 from "../../assets/Avatar4.png";
import avatar5 from "../../assets/Avatar5.png";
import avatar6 from "../../assets/Avatar6.png";

interface Trivia {
  id: string;
  title: string;
  description: string;
  questions: number;
  timeLimit: string;
  reward: number;
  participants: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  completed: boolean;
  score?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export function TriviasQuizzes() {
  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "leaderboard"
  >("active");
  const [selectedTrivia, setSelectedTrivia] =
    useState<Trivia | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    number | null
  >(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const activeTrivias: Trivia[] = [
    {
      id: "1",
      title: "Historia del Valencia CF",
      description:
        "Demuestra tus conocimientos sobre la rica historia del club",
      questions: 10,
      timeLimit: "3 días",
      reward: 50,
      participants: 856,
      difficulty: "medium",
      category: "Historia",
      completed: false,
    },
    {
      id: "2",
      title: "Quiz de la Semana",
      description: "Preguntas sobre la actualidad del equipo",
      questions: 15,
      timeLimit: "2 días",
      reward: 75,
      participants: 1234,
      difficulty: "easy",
      category: "Actualidad",
      completed: false,
    },
    {
      id: "3",
      title: "Leyendas del Mestalla",
      description:
        "Reconoce a los grandes jugadores de la historia",
      questions: 20,
      timeLimit: "5 días",
      reward: 100,
      participants: 634,
      difficulty: "hard",
      category: "Jugadores",
      completed: false,
    },
    {
      id: "4",
      title: "Tácticas y Formaciones",
      description: "Pon a prueba tus conocimientos tácticos",
      questions: 12,
      timeLimit: "4 días",
      reward: 60,
      participants: 423,
      difficulty: "hard",
      category: "Táctica",
      completed: false,
    },
  ];

  const completedTrivias: Trivia[] = [
    {
      id: "5",
      title: "Copa del Rey",
      description: "Las copas ganadas por el Valencia",
      questions: 10,
      timeLimit: "Finalizado",
      reward: 50,
      participants: 2145,
      difficulty: "medium",
      category: "Palmarés",
      completed: true,
      score: 90,
    },
    {
      id: "6",
      title: "Derbi Regional",
      description: "Historia de los derbis valencianos",
      questions: 15,
      timeLimit: "Finalizado",
      reward: 75,
      participants: 1876,
      difficulty: "medium",
      category: "Rivalidad",
      completed: true,
      score: 85,
    },
    {
      id: "7",
      title: "Temporada 2023/24",
      description: "Revive la temporada pasada",
      questions: 12,
      timeLimit: "Finalizado",
      reward: 60,
      participants: 3421,
      difficulty: "easy",
      category: "Temporada",
      completed: true,
      score: 75,
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "Usuario1",
      score: 4200,
      trivias: 45,
      avatar: avatar1,
    },
    {
      rank: 2,
      name: "Usuario2",
      score: 3800,
      trivias: 42,
      avatar: avatar2,
    },
    {
      rank: 3,
      name: "Usuario3",
      score: 3500,
      trivias: 38,
      avatar: avatar3,
    },
    {
      rank: 4,
      name: "Usuario4",
      score: 3200,
      trivias: 35,
      avatar: avatar4,
    },
    {
      rank: 5,
      name: "Usuario5",
      score: 3000,
      trivias: 33,
      avatar: avatar5,
    },
    {
      rank: 6,
      name: "Usuario6",
      score: 2850,
      trivias: 31,
      avatar: avatar6,
    },
    {
      rank: 7,
      name: "Usuario7",
      score: 2700,
      trivias: 29,
      avatar: "",
    },
    {
      rank: 8,
      name: "Usuario8",
      score: 2550,
      trivias: 27,
      avatar: "",
    },
  ];

  // Preguntas de ejemplo
  const quizQuestions: Question[] = [
    {
      id: "1",
      question: "¿En qué año fue fundado el Valencia CF?",
      options: ["1918", "1919", "1920", "1921"],
      correctAnswer: 1,
    },
    {
      id: "2",
      question:
        "¿Cuántas Copas del Rey ha ganado el Valencia CF?",
      options: ["6", "7", "8", "9"],
      correctAnswer: 2,
    },
    {
      id: "3",
      question: "¿Cuál es el apodo del Valencia CF?",
      options: [
        "Los Blancos",
        "Los Che",
        "Los Leones",
        "Los Murciélagos",
      ],
      correctAnswer: 1,
    },
    {
      id: "4",
      question: "¿Cómo se llama el estadio del Valencia CF?",
      options: [
        "Santiago Bernabéu",
        "Camp Nou",
        "Mestalla",
        "Ramón Sánchez-Pizjuán",
      ],
      correctAnswer: 2,
    },
    {
      id: "5",
      question: "¿En qué año ganó el Valencia su primera Liga?",
      options: ["1941", "1942", "1943", "1944"],
      correctAnswer: 1,
    },
  ];

  const difficultyColors = {
    easy: "bg-vcf-orange",
    medium: "bg-vcf-orange",
    hard: "bg-black",
  };

  const difficultyLabels = {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
  };

  const handleStartTrivia = (trivia: Trivia) => {
    setSelectedTrivia(trivia);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setQuizComplete(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerIndex);
      setShowResult(true);

      if (
        answerIndex ===
        quizQuestions[currentQuestion].correctAnswer
      ) {
        setScore(score + 1);
      }

      setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          setQuizComplete(true);
        }
      }, 2000);
    }
  };

  const handleFinishQuiz = () => {
    setSelectedTrivia(null);
    setQuizComplete(false);
  };

  if (quizComplete && selectedTrivia) {
    const percentage = Math.round(
      (score / quizQuestions.length) * 100,
    );
    const earnedPoints = Math.round(
      (percentage / 100) * selectedTrivia.reward,
    );

    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-card border-2 border-vcf-orange rounded-xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-vcf-orange rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy size={48} className="text-white" />
            </div>

            <h2 className="text-4xl font-black mb-4 text-foreground">
              ¡QUIZ{" "}
              <span className="text-vcf-orange">
                COMPLETADO
              </span>
              !
            </h2>

            <div className="bg-muted rounded-lg p-6 mb-6">
              <div className="text-6xl font-black mb-2 text-vcf-orange">
                {percentage}%
              </div>
              <div className="text-xl text-muted-foreground mb-4">
                {score} de {quizQuestions.length} respuestas
                correctas
              </div>

              <div className="flex items-center justify-center gap-2 text-2xl font-black text-foreground">
                <Award className="text-vcf-orange" size={32} />
                <span>+{earnedPoints} PUNTOS</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-black mb-1 text-vcf-orange">
                  {score}
                </div>
                <div className="text-sm text-muted-foreground font-bold">
                  Correctas
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-black mb-1 text-black">
                  {quizQuestions.length - score}
                </div>
                <div className="text-sm text-muted-foreground font-bold">
                  Incorrectas
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-black mb-1 text-vcf-orange">
                  #{12}
                </div>
                <div className="text-sm text-muted-foreground font-bold">
                  Ranking
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleFinishQuiz}
                className="flex-1 py-4 bg-vcf-orange text-white rounded-lg font-bold hover:bg-[#a86d12] transition-colors shadow-lg"
              >
                CONTINUAR
              </button>
              <button
                onClick={() => {
                  setQuizComplete(false);
                  setCurrentQuestion(0);
                  setScore(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                }}
                className="flex-1 py-4 bg-card border-2 border-vcf-orange text-vcf-orange rounded-lg font-bold hover:bg-vcf-orange hover:text-black transition-colors shadow-md"
              >
                REINTENTAR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTrivia) {
    const currentQ = quizQuestions[currentQuestion];
    const progress =
      ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-content py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header con botón de volver */}
          <div className="mb-6">
            <button
              onClick={() => {
                setSelectedTrivia(null);
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowResult(false);
              }}
              className="px-4 py-2 bg-muted text-foreground border-2 border-border rounded-lg hover:bg-border transition-colors font-bold flex items-center gap-2"
            >
              ← VOLVER A TRIVIAS
            </button>
          </div>

          {/* Header */}
          <div className="bg-card border-2 border-vcf-orange rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-foreground mb-1">
                  {selectedTrivia.title}
                </h2>
                <p className="text-muted-foreground">
                  Pregunta {currentQuestion + 1} de{" "}
                  {quizQuestions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-vcf-orange">
                  {score}
                </div>
                <div className="text-sm text-muted-foreground font-bold">
                  Puntos
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-vcf-orange transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
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
                      ? "border-border hover:border-vcf-orange hover:bg-muted text-foreground"
                      : selectedAnswer === index
                        ? index === currentQ.correctAnswer
                          ? "border-vcf-orange bg-vcf-orange/10 text-foreground"
                          : "border-black bg-black/10 text-foreground"
                        : index === currentQ.correctAnswer
                          ? "border-vcf-orange bg-vcf-orange/10 text-foreground"
                          : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {index === currentQ.correctAnswer && (
                          <CheckCircle
                            className="text-vcf-orange"
                            size={24}
                          />
                        )}
                        {selectedAnswer === index &&
                          index !== currentQ.correctAnswer && (
                            <XCircle
                              className="text-black"
                              size={24}
                            />
                          )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedTrivia(null);
              setCurrentQuestion(0);
              setScore(0);
              setSelectedAnswer(null);
              setShowResult(false);
            }}
            className="w-full py-4 bg-black text-white rounded-lg font-bold hover:bg-black/80 transition-colors shadow-lg"
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
          TRIVIAS &{" "}
          <span className="text-vcf-orange">QUIZZES</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Demuestra tus conocimientos y gana recompensas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b-2 border-border">
        {[
          { id: "active", label: "DESAFÍOS ACTIVOS" },
          { id: "completed", label: "COMPLETADOS" },
          { id: "leaderboard", label: "CLASIFICACIÓN" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-black transition-all text-base ${
              activeTab === tab.id
                ? "border-b-4 border-vcf-orange text-vcf-orange"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Trivias */}
      {activeTab === "active" && (
        <div>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Disponibles",
                value: activeTrivias.length,
                icon: Gamepad2,
                color: "bg-vcf-orange",
              },
              {
                label: "Total Completados",
                value: completedTrivias.length,
                icon: CheckCircle,
                color: "bg-vcf-orange",
              },
              {
                label: "Puntos Ganados",
                value: "1,840",
                icon: Star,
                color: "bg-vcf-orange",
              },
              {
                label: "Tu Ranking",
                value: "#24",
                icon: Trophy,
                color: "bg-black",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-card border-2 border-border rounded-xl p-5 shadow-md hover:border-vcf-orange transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-11 h-11 ${stat.color} rounded-lg flex items-center justify-center shadow-md`}
                  >
                    <stat.icon
                      size={22}
                      className="text-white"
                    />
                  </div>
                  <div className="text-3xl font-black text-foreground">
                    {stat.value}
                  </div>
                </div>
                <div className="text-base text-muted-foreground font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTrivias.map((trivia) => (
              <div
                key={trivia.id}
                className="bg-card border-2 border-border rounded-xl p-6 hover:border-vcf-orange transition-all shadow-md hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-vcf-orange rounded-lg flex items-center justify-center shadow-md">
                      <Gamepad2
                        size={24}
                        className="text-white"
                      />
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
                    className={`${
                      trivia.difficulty === "easy"
                        ? "bg-vcf-orange text-white"
                        : trivia.difficulty === "medium"
                          ? "bg-vcf-orange text-white"
                          : "bg-black text-white"
                    } px-3 py-1 rounded-full text-sm font-black shadow-md`}
                  >
                    {difficultyLabels[trivia.difficulty]}
                  </span>
                </div>

                <p className="text-base text-muted-foreground mb-5">
                  {trivia.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
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
                  <div className="text-center p-3 bg-muted rounded-lg shadow-sm">
                    <div className="text-2xl font-black mb-1 text-foreground">
                      {trivia.participants}
                    </div>
                    <div className="text-sm text-muted-foreground font-bold">
                      Jugadores
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <Clock
                      size={16}
                      className="text-vcf-orange"
                    />
                    <span>Termina en {trivia.timeLimit}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartTrivia(trivia)}
                  className="px-6 md:px-8 py-3 md:py-4 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#a86d12] hover:border-[#a86d12] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base w-full"
                >
                  COMENZAR QUIZ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Trivias */}
      {activeTab === "completed" && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-black mb-2 text-foreground">
              TUS TRIVIAS{" "}
              <span className="text-vcf-orange">
                COMPLETADAS
              </span>
            </h2>
            <p className="text-base text-muted-foreground">
              Has completado {completedTrivias.length} trivias
            </p>
          </div>

          <div className="space-y-4">
            {completedTrivias.map((trivia) => (
              <div
                key={trivia.id}
                className="bg-card border-2 border-border rounded-xl p-6 flex items-center justify-between shadow-md hover:border-vcf-orange transition-all"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div
                    className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center ${
                      trivia.score! >= 80
                        ? "bg-vcf-orange"
                        : trivia.score! >= 60
                          ? "bg-vcf-orange"
                          : "bg-muted"
                    } text-white shadow-lg`}
                  >
                    <div className="text-2xl font-black">
                      {trivia.score}%
                    </div>
                    <div className="text-xs font-black">
                      SCORE
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black text-xl mb-1 text-foreground">
                      {trivia.title}
                    </h3>
                    <p className="text-base text-muted-foreground mb-2">
                      {trivia.description}
                    </p>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <span>{trivia.questions} preguntas</span>
                      <span>•</span>
                      <span className="text-vcf-orange font-black">
                        +
                        {Math.round(
                          (trivia.score! / 100) * trivia.reward,
                        )}{" "}
                        puntos ganados
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-card text-foreground rounded-lg font-black hover:bg-muted transition-all shadow-lg hover:shadow-xl hover:scale-105 text-base">
                    VER RESPUESTAS
                  </button>

                  <button
                    onClick={() => handleStartTrivia(trivia)}
                    className="px-4 py-2 bg-vcf-orange text-white rounded-lg font-black hover:bg-[#a86d12] transition-all shadow-lg hover:shadow-xl hover:scale-105 text-base"
                  >
                    REINTENTAR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === "leaderboard" && (
        <div>
          <div className="bg-gradient-to-r from-black via-vcf-orange to-black text-white rounded-xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black mb-2">
                  TU{" "}
                  <span className="text-white">POSICIÓN</span>
                </h2>
                <p className="opacity-90">
                  Ranking semanal de trivias
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-black mb-2 text-white">
                  #24
                </div>
                <div className="text-lg opacity-90">
                  1,840 puntos
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {leaderboard.slice(0, 3).map((user, i) => {
              const positions = [1, 0, 2]; // Reorder for podium effect
              const actualUser = leaderboard[positions[i]];
              return (
                <div
                  key={actualUser.rank}
                  className={`text-center ${positions[i] === 0 ? "transform scale-110" : ""}`}
                >
                  <div
                    className={`w-24 h-24 mx-auto rounded-full mb-4 flex items-center justify-center ${
                      actualUser.rank === 1
                        ? "bg-vcf-orange"
                        : actualUser.rank === 2
                          ? "bg-black"
                          : "bg-vcf-orange"
                    } text-white shadow-2xl`}
                  >
                    <span className="text-4xl font-black">
                      {actualUser.rank}
                    </span>
                  </div>
                  {actualUser.avatar ? (
                    <img
                      src={actualUser.avatar}
                      alt={actualUser.name}
                      className="w-20 h-20 rounded-full mx-auto mb-3 shadow-md object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-vcf-orange rounded-full mx-auto mb-3 shadow-md"></div>
                  )}
                  <div className="font-black text-lg mb-1 text-foreground">
                    {actualUser.name}
                  </div>
                  <div className="text-2xl font-black mb-1 text-vcf-orange">
                    {actualUser.score}
                  </div>
                  <div className="text-sm text-muted-foreground font-bold">
                    {actualUser.trivias} trivias
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Leaderboard */}
          <div className="bg-card border-2 border-vcf-orange rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 border-b-2 border-border bg-vcf-orange/10">
              <h3 className="font-black text-foreground">
                TOP 100{" "}
                <span className="text-vcf-orange">
                  JUGADORES
                </span>
              </h3>
            </div>
            <div className="divide-y divide-border">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black shadow-md ${
                        user.rank <= 3
                          ? "bg-vcf-orange text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {user.rank}
                    </div>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full shadow-md object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-vcf-orange rounded-full shadow-md"></div>
                    )}
                    <div>
                      <div className="font-bold text-foreground">
                        {user.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.trivias} trivias completadas
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-foreground">
                      {user.score}
                    </div>
                    <div className="text-xs text-muted-foreground font-bold">
                      puntos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}