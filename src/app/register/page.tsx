"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image"; // 👈 CORREÇÃO: Importado Image
import { Mail, Lock, User, Repeat2 } from "lucide-react";
import "../styles/RegisterApp.css";

const RegisterApp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);

      if (!name || !email || !password || !confirmPassword) {
        setError("Por favor, preencha todos os campos obrigatórios.");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        setIsLoading(false);
        return;
      }

      // Simula tempo de requisição
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess("Cadastro realizado com sucesso! Você já pode fazer login.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsLoading(false);
    },
    [name, email, password, confirmPassword]
  );

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Cabeçalho */}
        <div className="register-header">
          {/* 👈 CORREÇÃO: Substituído <img> por <Image /> (Linha 59) */}
          <Image
            src="/images/logo-solucell.png"
            alt="Logo"
            className="register-logo"
            width={150} // Valores arbitrários, ajuste conforme necessário
            height={50} // Valores arbitrários, ajuste conforme necessário
          />
          <h2>Crie sua Conta</h2>
          <p>
            Junte-se a nós e tenha acesso a ofertas exclusivas e acompanhe seus
            pedidos.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <User size={18} className="icon" />
            <input
              type="text"
              placeholder="Nome Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <Mail size={18} className="icon" />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="icon" />
            <input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <Repeat2 size={18} className="icon" />
            <input
              type="password"
              placeholder="Confirme a Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Criar Conta"}
          </button>
        </form>

        {/* Rodapé */}
        <div className="register-footer">
          Já tem uma conta?
          <a href="/login" onClick={() => console.log("Ir para Login")}>
            Faça Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterApp;