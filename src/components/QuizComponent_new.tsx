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
  answers: Record<string, number>;
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

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQ = quiz.questions[state.currentQuestion];
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [currentQ.id]: answerIndex },
    }));
  };

  const handleNext = () => {
    if (state.currentQuestion < quiz.questions.length - 1) {
      setState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    } else {
      handleSubmitQuiz();
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = () => {
    if (state.score >= 90) return "#10b981";
    if (state.score >= 70) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreMessage = () => {
    if (state.score >= 90) return "¡Excelente trabajo!";
    if (state.score >= 80) return "¡Muy bien!";
    if (state.score >= 70) return "Buen trabajo";
    if (state.score >= 60) return "Puedes mejorar";
    return "Necesitas repasar más";
  };

  const currentQ = quiz.questions[state.currentQuestion];
  const isLastQuestion = state.currentQuestion === quiz.questions.length - 1;
  const hasSelectedAnswer = state.answers[currentQ.id] !== undefined;

  if (state.showResults) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="header-actions">
            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Cerrar quiz"
            >
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
                    quiz.questions.filter((q) => {
                      const userAnswer = state.answers[q.id];
                      if (q.type === "true-false") {
                        const userBooleanAnswer = userAnswer === 1;
                        return userBooleanAnswer === q.correctAnswer;
                      } else {
                        return userAnswer === q.correctAnswer;
                      }
                    }).length
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
                    <div key={question.id} className="question-review">
                      <h5>
                        Pregunta {index + 1}:{" "}
                        {isCorrect ? (
                          <span className="answer-icon correct">✅</span>
                        ) : (
                          <span className="answer-icon incorrect">❌</span>
                        )}
                      </h5>
                      <p className="review-question">{question.question}</p>

                      <div className="review-answers">
                        {question.type === "true-false" ? (
                          <>
                            <div
                              className={`review-answer ${
                                question.correctAnswer === true
                                  ? "correct"
                                  : userAnswer === 1
                                  ? "incorrect user-selected"
                                  : ""
                              }`}
                            >
                              <span className="answer-icon">
                                {question.correctAnswer === true ? "✅" : ""}
                                {userAnswer === 1 &&
                                question.correctAnswer !== true
                                  ? "❌"
                                  : ""}
                              </span>
                              Verdadero
                            </div>
                            <div
                              className={`review-answer ${
                                question.correctAnswer === false
                                  ? "correct"
                                  : userAnswer === 0
                                  ? "incorrect user-selected"
                                  : ""
                              }`}
                            >
                              <span className="answer-icon">
                                {question.correctAnswer === false ? "✅" : ""}
                                {userAnswer === 0 &&
                                question.correctAnswer !== false
                                  ? "❌"
                                  : ""}
                              </span>
                              Falso
                            </div>
                          </>
                        ) : (
                          question.options?.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`review-answer ${
                                optIndex === question.correctAnswer
                                  ? "correct"
                                  : optIndex === userAnswer
                                  ? "incorrect user-selected"
                                  : ""
                              }`}
                            >
                              <span className="answer-icon">
                                {optIndex === question.correctAnswer
                                  ? "✅"
                                  : ""}
                                {optIndex === userAnswer &&
                                optIndex !== question.correctAnswer
                                  ? "❌"
                                  : ""}
                              </span>
                              {option}
                            </div>
                          ))
                        )}
                      </div>

                      {question.explanation && (
                        <div className="review-explanation">
                          <strong>Explicación:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="results-actions">
              <button className="continue-button" onClick={onClose}>
                {state.passed ? "Continuar" : "Volver a la lección"}
              </button>
              <button
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Repetir Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-title">{quiz.title}</h2>
        <div className="quiz-info">
          <span className="quiz-progress">
            Pregunta {state.currentQuestion + 1} de {quiz.questions.length}
          </span>
          {state.timeRemaining !== null && (
            <span
              className={`quiz-timer ${
                state.timeRemaining < 60 ? "warning" : ""
              }`}
            >
              ⏱️ {formatTime(state.timeRemaining)}
            </span>
          )}
        </div>
      </div>

      <div className="question-container">
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

      <div className="quiz-navigation">
        <button
          className="nav-button prev-button"
          onClick={handlePrevious}
          disabled={state.currentQuestion === 0}
        >
          ← Anterior
        </button>

        <button
          className={`nav-button ${
            isLastQuestion ? "finish-button" : "next-button"
          }`}
          onClick={handleNext}
          disabled={!hasSelectedAnswer}
        >
          {isLastQuestion ? "Finalizar Quiz" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}
