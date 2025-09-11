import React, { useState } from 'react';
import { login } from '../services/apiService';
import { login } from 'react-router-dom';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    senha: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(credentials);
      console.log('Resposta da API:', data);
      alert('Login realizado com sucesso!');
    } catch (error) {
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          name="senha"
          value={credentials.senha}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;