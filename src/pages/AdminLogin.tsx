import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Informe a senha.');
      return;
    }
    // Armazena a senha em sessionStorage apenas para esta sessão
    sessionStorage.setItem('adminPassword', password);
    // Redireciona para a página de administração
    navigate('/admin/redirect-links');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Login Admin</h1>
        <label className="block mb-2 text-sm">Senha</label>
        <input
          type="password"
          className="w-full border rounded p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700">Entrar</button>
        <p className="text-xs text-gray-500 mt-3">Apenas usuários autorizados.</p>
      </form>
    </div>
  );
}