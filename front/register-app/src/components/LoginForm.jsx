import React, { useState } from 'react';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.status === 200) {
                if (data.mensagem) {
                    alert(data.mensagem);
                } else {
                    alert('Login bem-sucedido!');
                }
                localStorage.setItem('token', data.token);
                // Redirecionar ou outras ações aqui
            } else {
                if (data && data.error) {
                    alert(data.error);
                } else {
                    alert('Erro ao realizar o login. Tente novamente.');
                }
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor.');
        }
    };

    return (
        <div className="form_wrapper">
            <div className="form_container">
                <div className="title_container">
                    <h2>Formulário de Login</h2>
                </div>
                <div className="row clearfix">
                    <div>
                        <form id="loginForm" onSubmit={handleSubmit}>
                            <div className="input_field">
                                <span><i className="fa fa-envelope" aria-hidden="true"></i></span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="E-mail"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="input_field">
                                <span><i className="fa fa-lock" aria-hidden="true"></i></span>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Senha"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="input_field checkbox_option">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="rememberMe">Lembrar de mim</label>
                            </div>
                            <input className="button" type="submit" value="Entrar" />
                            <div className="extraLinks">
                                <a className="customLink" href="register.html">Criar uma nova conta</a>
                                <a className="customLink" href="forgot.html">Esqueci minha senha</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <p className="credit">Brain Tutor por <a target="_blank" href="#">Giovana Miyuki & Natália Vasques</a></p>
        </div>
    );
};

export default LoginForm;