"use client";

import React, { useState, useCallback } from "react";
import { Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import "../styles/LoginApp.css";

const LoginApp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsLoading(true);

      if (!email || !password) {
        setError("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }

      // Simulação de autenticação
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email === "teste@exemplo.com" && password === "123456") {
        setSuccess("Login realizado com sucesso!");
      } else {
        setError("E-mail ou senha incorretos.");
      }

      setIsLoading(false);
    },
    [email, password]
  );

  const handleSocialLogin = (provider: "google" | "facebook") => {
    console.log(`Simulação login com ${provider}`);
    alert(`Simulação login com ${provider}`);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/images/logo-solucell.png" alt="Logo" className="login-logo" />
          <h2>Faça Login</h2>
          <p>Entre em sua conta para acessar ofertas exclusivas.</p>
        </div>

        {/* Login Social */}
        <div className="social-login">
          <button
            type="button"
            className="social-button google"
            onClick={() => handleSocialLogin("google")}
          >
            <FcGoogle size={20} />
            Entrar com Google
          </button>

          <button
            type="button"
            className="social-button facebook"
            onClick={() => handleSocialLogin("facebook")}
          >
            <FaFacebookF size={18} />
            Entrar com Facebook
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
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
            <Lock size={20} className="icon" />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Login"}
          </button>

          <div className="forgot-password">
            <a href="/reset-password">Esqueceu a senha?</a>
          </div>
        </form>

        <div className="login-footer">
          Não tem uma conta?
          <a
            href="/register"
            onClick={() => console.log("Simulação: Navegar para Cadastro")}
          >
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginApp;
