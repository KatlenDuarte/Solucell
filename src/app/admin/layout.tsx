// Exemplo: app/admin/layout.tsx (ou onde você define seu layout de admin)

"use client" // Adicione o "use client" se estiver usando o App Router, pois o Toaster precisa de estado.

import React from 'react';
import { Toaster } from 'react-hot-toast'; // 👈 IMPORTANTE: Importe o Toaster
import Sidebar from './components/SiderBar'; // Assumindo que este é o caminho correto

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', background: '#f9fafb' }}>
        {children}
        {/* 💡 ADICIONE O TOASTER AQUI! Ele renderizará todos os modals e toasts na tela. */}
        <Toaster position="top-right" />
      </main>
    </div>
  )
}