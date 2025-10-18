"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image"; // 👈 CORREÇÃO: Importado Image
import { Mail } from "lucide-react";
import "../styles/ResetPasswordApp.css";

const ResetPasswordApp = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);

      if (!email) {
        setError("Por favor, informe seu e-mail.");
        setIsLoading(false);
        return;
      }

      // Simula requisição de redefinição
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(
        "Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha."
      );
      setEmail("");
      setIsLoading(false);
    },
    [email]
  );

  return (
    <div className="reset-container">
      <div className="reset-box">
        <div className="reset-header">
          {/* 👈 CORREÇÃO: Substituído <img> por <Image /> (Linha 42) */}
          <Image 
            src="/images/logo-solucell.png" 
            alt="Logo" 
            className="reset-logo" 
            width={150} // Valores arbitrários, ajuste conforme necessário
            height={50} // Valores arbitrários, ajuste conforme necessário
          />
          <h2>Redefinir Senha</h2>
          <p>Informe seu e-mail e enviaremos um link para redefinir sua senha.</p>
        </div>

        <form onSubmit={handleReset} className="reset-form">
          <div className="input-group">
            <Mail size={18} className="icon" />
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>

        <div className="reset-footer">
          <a href="/login">Voltar para o login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordApp;