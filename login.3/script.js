document.addEventListener('DOMContentLoaded', () => {
    const loginFormWrapper = document.querySelector('.login-form');
    const signupFormWrapper = document.querySelector('.signup-form');
    const forgotPasswordFormWrapper = document.querySelector('.forgot-password-form');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const showLoginFromForgotLink = document.getElementById('showLoginFromForgot');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const sendRecoveryEmailButton = document.getElementById('sendRecoveryEmail');
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const mensagemLogin = document.getElementById('login-mensagem');
    const mensagemCadastro = document.getElementById('cadastro-mensagem');
    const forgotPasswordMensagem = document.getElementById('forgot-password-mensagem');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const forgotPasswordEmailInput = document.getElementById('forgotPasswordEmail');

 
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormWrapper.classList.add('inactive');
        signupFormWrapper.classList.add('active');
        forgotPasswordFormWrapper.classList.remove('active');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormWrapper.classList.remove('active');
        loginFormWrapper.classList.remove('inactive');
        forgotPasswordFormWrapper.classList.remove('active');
    });

    
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormWrapper.classList.add('inactive');
        signupFormWrapper.classList.remove('active');
        forgotPasswordFormWrapper.classList.add('active');
    });

    
    showLoginFromForgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordFormWrapper.classList.remove('active');
        loginFormWrapper.classList.remove('inactive');
    });

    
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPassword = localStorage.getItem('rememberedPassword');
    if (storedEmail && storedPassword) {
        loginEmailInput.value = storedEmail;
        loginPasswordInput.value = storedPassword;
        rememberMeCheckbox.checked = true;
    }

    
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        const remember = rememberMeCheckbox.checked;

        if (remember) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await fetch('login.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                mensagemLogin.textContent = 'Login bem-sucedido! Redirecionando...';
                mensagemLogin.className = 'mensagem sucesso';
                setTimeout(() => {
                    window.location.href = '/dashboard.html'; 
                }, 2000);
            } else {
                mensagemLogin.textContent = data.message || 'Erro ao fazer login.';
                mensagemLogin.className = 'mensagem erro';
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            mensagemLogin.textContent = 'Não foi possível conectar ao servidor.';
            mensagemLogin.className = 'mensagem erro';
        }
    });


    cadastroForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nome = document.getElementById('signupNome').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await fetch('cadastro.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                mensagemCadastro.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
                mensagemCadastro.className = 'mensagem sucesso';
                setTimeout(() => {
                    signupFormWrapper.classList.remove('active');
                    loginFormWrapper.classList.remove('inactive');
                    forgotPasswordFormWrapper.classList.remove('active');
                }, 2000);
            } else {
                mensagemCadastro.textContent = data.message || 'Erro ao cadastrar.';
                mensagemCadastro.className = 'mensagem erro';
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            mensagemCadastro.textContent = 'Não foi possível conectar ao servidor.';
            mensagemCadastro.className = 'mensagem erro';
        }
    });

    sendRecoveryEmailButton.addEventListener('click', async () => {
        const email = forgotPasswordEmailInput.value;

        if (!email) {
            forgotPasswordMensagem.textContent = 'Por favor, digite seu e-mail.';
            forgotPasswordMensagem.className = 'mensagem erro';
            return;
        }

        const formData = new FormData();
        formData.append('email', email);

        try {
            const response = await fetch('forgot_password.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                forgotPasswordMensagem.textContent = data.message || 'Um link de recuperação foi enviado para o seu e-mail.';
                forgotPasswordMensagem.className = 'mensagem sucesso';
           
            } else {
                forgotPasswordMensagem.textContent = data.message || 'Erro ao solicitar a recuperação de senha.';
                forgotPasswordMensagem.className = 'mensagem erro';
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            forgotPasswordMensagem.textContent = 'Não foi possível conectar ao servidor.';
            forgotPasswordMensagem.className = 'mensagem erro';
        }
    });
});