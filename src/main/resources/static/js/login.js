(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        /* Toggle contraseña */
        const toggleBtn   = document.getElementById('togglePassword');
        const passwordFld = document.getElementById('password');

        if (toggleBtn && passwordFld) {
            toggleBtn.addEventListener('click', function () {
                const show = passwordFld.type === 'password';
                passwordFld.type = show ? 'text' : 'password';

                toggleBtn.querySelector('.eye-icon').innerHTML = show
                    ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                             d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7
                                a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
                                M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532
                                l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5
                                c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>`
                    : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                             d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                             d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                                -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>`;
            });
        }

        /* Submit: validación + loading */
        const loginForm   = document.getElementById('loginForm');
        const submitBtn   = document.getElementById('submitBtn');
        const emailFld    = document.getElementById('email');
        let submitted     = false;

        if (loginForm) {
            loginForm.addEventListener('submit', function (e) {
                if (submitted) { e.preventDefault(); return; }

                const email    = emailFld    ? emailFld.value.trim() : '';
                const password = passwordFld ? passwordFld.value     : '';

                if (!email || !password) {
                    e.preventDefault();
                    showAlert('Por favor completa todos los campos');
                    return;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    e.preventDefault();
                    showAlert('Ingresa un correo electrónico válido');
                    return;
                }

                submitted = true;
                if (submitBtn) submitBtn.classList.add('loading');
                setTimeout(() => { submitted = false; }, 6000);
            });
        }

        function showAlert(msg) {
            document.querySelectorAll('.temp-alert').forEach(a => a.remove());
            const div = document.createElement('div');
            div.className = 'alert alert-error temp-alert';
            div.innerHTML = `
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414
                             L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293
                             a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414
                             L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span>${msg}</span>`;
            loginForm.prepend(div);
            setTimeout(() => {
                div.style.transition = 'opacity .3s';
                div.style.opacity = '0';
                setTimeout(() => div.remove(), 320);
            }, 3000);
        }

    });
}());