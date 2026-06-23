'use client';

import { useState } from 'react';
import ProgressBar from './ProgressBar';

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  feedback: { correct: string; wrong: string };
}

interface QuizBlockProps {
  questions: QuizQuestion[];
  moduleId: string;
  passThreshold: number;
  onResult: (passed: boolean, score: number) => void;
}

export default function QuizBlock({ questions, moduleId, passThreshold, onResult }: QuizBlockProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const selectOption = (questionId: string, optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const score = questions.reduce((acc, q) => {
    const chosen = q.options.find((o) => o.id === answers[q.id]);
    return acc + (chosen?.correct ? 1 : 0);
  }, 0);

  const passed = score >= passThreshold;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitted(true);

    const answerMap = Object.fromEntries(
      questions.map((q) => [q.id, q.options.find((o) => o.id === answers[q.id])?.correct ?? false])
    );

    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, answers: answerMap, score, passed }),
      });
    } finally {
      setSubmitting(false);
      onResult(passed, score);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="my-8">
      <h2 className="text-[11px] uppercase tracking-wider text-zinc-500 mb-3">Quiz</h2>
      <ProgressBar percent={(answeredCount / questions.length) * 100} />

      <div className="mt-5 space-y-6">
        {questions.map((q, i) => {
          const chosenId = answers[q.id];
          return (
            <div key={q.id}>
              <p className="text-[15px] text-zinc-200 mb-2.5">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isChosen = chosenId === opt.id;
                  let cls = 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-600';
                  if (submitted) {
                    if (opt.correct) cls = 'border-[#085041] bg-[#E1F5EE] text-[#085041]';
                    else if (isChosen) cls = 'border-[#501313] bg-[#FCEBEB] text-[#501313]';
                    else cls = 'border-zinc-800 bg-zinc-900/40 text-zinc-500';
                  } else if (isChosen) {
                    cls = 'border-[#1D9E75] bg-[#1D9E75]/10 text-white';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={submitted}
                      onClick={() => selectOption(q.id, opt.id)}
                      className={`w-full text-left rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${cls}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {submitted && chosenId && (
                <p className="mt-2 text-xs text-zinc-400">
                  {q.options.find((o) => o.id === chosenId)?.correct
                    ? q.feedback.correct
                    : q.feedback.wrong}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          disabled={!allAnswered}
          onClick={handleSubmit}
          className="mt-6 rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 transition-colors"
          style={{ backgroundColor: 'var(--c-teal)' }}
        >
          Submit answers
        </button>
      )}

      {submitted && !passed && (
        <div className="mt-6 flex items-center gap-3">
          <p className="text-sm text-zinc-400">
            Score: {score}/{questions.length} — need {passThreshold} to pass.
          </p>
          <button
            onClick={handleRetry}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500"
          >
            Retry
          </button>
        </div>
      )}

      {submitted && passed && (
        <p className="mt-6 text-sm" style={{ color: 'var(--c-teal)' }}>
          Score: {score}/{questions.length} — passed.
        </p>
      )}
    </div>
  );
}
