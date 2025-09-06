import React, { useState, useEffect } from "react";
import { Quiz, QuizQuestion } from "../data/types";

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (
    passed: boolean,
    score: number,
    answers: Record<string, number>
  ) => void;
  onClose: () => void;
}

interface QuizState {
  currentQuestion: number;
                         <span className="option-text">{option}</span>
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="quiz-footer">{/* Navigation section */}Record<string, number>;
  timeRemaining: number | null;
  showResults: boolean;
  score: number;
  passed: boolean;
}

export default function QuizComponent({
  quiz,
  onComplete,
  onClose,
}: QuizComponentProps) {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: quiz.timeLimit ? quiz.timeLimit * 60 : null, // convertir a segundos
    showResults: false,
    score: 0,
    passed: false,
  });

  // Timer para el tiempo límite
  useEffect(() => {
    if (state.timeRemaining === null || state.showResults) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining === null || prev.timeRemaining <= 1) {
          handleSubmitQuiz(); // Auto-submit cuando se acaba el tiempo
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timeRemaining, state.showResults]);

  const currentQ = quiz.questions[state.currentQuestion];
  const isLastQuestion = state.currentQuestion === quiz.questions.length - 1;
  const hasAnsweredCurrent = state.answers[currentQ.id] !== undefined;

  const handleAnswerSelect = (answerIndex: number) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQ.id]: answerIndex,
      },
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    }
  };

  const handlePrevious = () => {
    if (state.currentQuestion > 0) {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }));
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = state.answers[question.id];
      let isCorrect = false;

      if (question.type === "true-false") {
        // Para true-false: userAnswer es 1 (true) o 0 (false)
        const userBooleanAnswer = userAnswer === 1;
        isCorrect = userBooleanAnswer === question.correctAnswer;
      } else {
        // Para multiple-choice: comparación directa de índices
        isCorrect = userAnswer === question.correctAnswer;
      }

      if (isCorrect) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore();
    const passed = finalScore >= quiz.passingScore;

    setState((prev) => ({
      ...prev,
      showResults: true,
      score: finalScore,
      passed,
    }));

    onComplete(passed, finalScore, state.answers);
  };

  const getScoreMessage = () => {
    if (state.score >= 90) return "¡Excelente! 🎉";
    if (state.score >= quiz.passingScore) return "¡Bien hecho! ✅";
    return "Necesitas estudiar un poco más 📚";
  };

  const getScoreColor = () => {
    if (state.score >= 90) return "#28a745";
    if (state.score >= quiz.passingScore) return "#007bff";
    return "#dc3545";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (state.showResults) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-modal">
          <div className="quiz-header">
            <h2>Resultados del Quiz</h2>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="quiz-body">
            <div className="results-summary">
              <div
                className="score-circle"
                style={{ "--score-color": getScoreColor() } as any}
              >
                <div className="score-text">
                  <span className="score-number">{state.score}%</span>
                  <span className="score-label">Puntuación</span>
                </div>
              </div>

              <div className="results-info">
                <h3 style={{ color: getScoreColor() }}>{getScoreMessage()}</h3>
                <p>
                  Respondiste correctamente{" "}
                  {
                    quiz.questions.filter(
                      (q) => state.answers[q.id] === q.correctAnswer
                    ).length
                  }{" "}
                  de {quiz.questions.length} preguntas.
                </p>
                <p>
                  {state.passed ? (
                    <span className="status-badge passed">✅ Aprobado</span>
                  ) : (
                    <span className="status-badge failed">❌ No aprobado</span>
                  )}
                </p>
              </div>
            </div>

            <div className="results-details">
              <h4>Revisión de respuestas:</h4>
              <div className="questions-review">
                {quiz.questions.map((question, index) => {
                  const userAnswer = state.answers[question.id];
                  let isCorrect = false;

                  if (question.type === "true-false") {
                    const userBooleanAnswer = userAnswer === 1;
                    isCorrect = userBooleanAnswer === question.correctAnswer;
                  } else {
                    isCorrect = userAnswer === question.correctAnswer;
                  }

                  return (
                    <div
                      key={question.id}
                      className={`question-review ${
                        isCorrect ? "correct" : "incorrect"
                      }`}
                    >
                      <div className="question-header">
                        <span className="question-number">#{index + 1}</span>
                        <span
                          className={`question-status ${
                            isCorrect ? "correct" : "incorrect"
                          }`}
                        >
                          {isCorrect ? "✅" : "❌"}
                        </span>
                      </div>
                      <p className="question-text">{question.question}</p>
                      <div className="answer-review">
                        <p>
                          <strong>Tu respuesta:</strong>{" "}
                          {question.type === "true-false"
                            ? userAnswer === 1
                              ? "Verdadero"
                              : "Falso"
                            : question.options?.[userAnswer] || "No respondida"}
                        </p>
                        {!isCorrect && (
                          <p>
                            <strong>Respuesta correcta:</strong>{" "}
                            {question.type === "true-false"
                              ? question.correctAnswer
                                ? "Verdadero"
                                : "Falso"
                              : question.options?.[
                                  question.correctAnswer as number
                                ] || "Error"}
                          </p>
                        )}
                        {question.explanation && (
                          <p className="explanation">
                            <strong>Explicación:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="quiz-footer">
            <button className="btn primary" onClick={onClose}>
              {state.passed ? "Continuar" : "Estudiar más"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal">
        <div className="quiz-header">
          <div className="quiz-info">
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
          </div>
          <div className="quiz-meta">
            {state.timeRemaining !== null && (
              <div
                className={`timer ${
                  state.timeRemaining < 300 ? "warning" : ""
                }`}
              >
                ⏱️ {formatTime(state.timeRemaining)}
              </div>
            )}
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((state.currentQuestion + 1) / quiz.questions.length) * 100
                }%`,
              }}
            />
          </div>
          <span className="progress-text">
            Pregunta {state.currentQuestion + 1} de {quiz.questions.length}
          </span>
        </div>

        <div className="quiz-body">
          <div className="question">
            <h3 className="question-text">{currentQ.question}</h3>

            {currentQ.code && (
              <div className="question-code">
                <pre>{currentQ.code}</pre>
              </div>
            )}

            <div className="options-list">
              {currentQ.type === "true-false"
                ? // Renderizar opciones para verdadero/falso
                  [
                    { text: "Verdadero", value: true },
                    { text: "Falso", value: false },
                  ].map((option, index) => (
                    <div key={index} className="option-item">
                      <button
                        className={`option-button ${
                          state.answers[currentQ.id] === (option.value ? 1 : 0)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleAnswerSelect(option.value ? 1 : 0)}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="option-text">{option.text}</span>
                      </button>
                    </div>
                  ))
                : // Renderizar opciones múltiples normales
                  currentQ.options?.map((option, index) => (
                    <div key={index} className="option-item">
                      <button
                        className={`option-button ${
                          state.answers[currentQ.id] === index ? "selected" : ""
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <span className="option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="option-text">{option}</span>
                      </button>
                    </div>
                  ))}
            </div>
            </div>
          </div>
        </div>

        <div className="quiz-footer">
          <div className="navigation">
            <button
              className="btn secondary"
              onClick={handlePrevious}
              disabled={state.currentQuestion === 0}
            >
              Anterior
            </button>

            <button
              className="btn primary"
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
            >
              {isLastQuestion ? "Finalizar Quiz" : "Siguiente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
