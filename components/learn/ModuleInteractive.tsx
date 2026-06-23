'use client';

import { useState } from 'react';
import QuizBlock, { type QuizQuestion } from './QuizBlock';
import ModuleGate from './ModuleGate';

interface ModuleInteractiveProps {
  moduleId: string;
  quiz: QuizQuestion[];
  passThreshold: number;
  nextSlug: string | null;
  initiallyPassed: boolean;
}

export default function ModuleInteractive({
  moduleId,
  quiz,
  passThreshold,
  nextSlug,
  initiallyPassed,
}: ModuleInteractiveProps) {
  const [passed, setPassed] = useState(initiallyPassed);

  return (
    <>
      <QuizBlock
        questions={quiz}
        moduleId={moduleId}
        passThreshold={passThreshold}
        onResult={(didPass) => setPassed(didPass)}
      />
      <ModuleGate passed={passed} nextSlug={nextSlug} />
    </>
  );
}
