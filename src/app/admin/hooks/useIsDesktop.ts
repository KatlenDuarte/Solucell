// src/hooks/useIsDesktop.ts

import { useState, useEffect } from 'react';

const DESKTOP_BREAKPOINT = 768; // Defina seu breakpoint em pixels

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    // Define o estado inicial
    handleResize();

    // Adiciona o listener de redimensionamento
    window.addEventListener('resize', handleResize);

    // Limpa o listener ao desmontar o componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
};