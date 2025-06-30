// Génération des particules animées
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Taille aléatoire
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Position horizontale aléatoire
    particle.style.left = `${Math.random() * 100}%`;

    // Durée d'animation aléatoire
    particle.style.animationDuration = `${Math.random() * 20 + 10}s`;

    // Délai aléatoire
    particle.style.animationDelay = `${Math.random() * 20}s`;

    particlesContainer.appendChild(particle);
  }
}

// Toggle password visibility
function setupPasswordToggle() {
  const toggleBtn = document.querySelector('.toggle-password');
  const passwordInput = document.querySelector('input[name="password"]');
  const eyeOpen = toggleBtn.querySelector('.eye-open');
  const eyeClosed = toggleBtn.querySelector('.eye-closed');

  toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeOpen.style.display = isPassword ? 'none' : 'block';
    eyeClosed.style.display = isPassword ? 'block' : 'none';
  });
}

// Afficher message d'erreur
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';

  // Masquer après 5 secondes
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// Gestion du formulaire
function setupLoginForm() {
  const form = document.getElementById('login-form');
  const submitBtn = form.querySelector('.submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.loading-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupération des données
    const formData = new FormData(form);
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password'),
      remember: formData.get('remember') === 'on'
    };

    // Validation basique
    if (!credentials.username || !credentials.password) {
      showError('Veuillez remplir tous les champs');
      return;
    }

    // Animation de chargement
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'flex';

    try {
      // Appel API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Stockage du token si "Se souvenir de moi" est coché
        if (credentials.remember && data.token) {
          localStorage.setItem('authToken', data.token);
        } else if (data.token) {
          sessionStorage.setItem('authToken', data.token);
        }

        // Animation de succès
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        btnText.textContent = 'Connexion réussie !';
        btnText.style.display = 'block';
        spinner.style.display = 'none';

        // Redirection selon le rôle
        setTimeout(() => {
          redirectUser(data.role);
        }, 1000);

      } else {
        // Gestion des erreurs
        throw new Error(data.error || 'Erreur de connexion');
      }

    } catch (error) {
      // Affichage de l'erreur
      showError(error.message);

      // Reset du bouton
      submitBtn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';

      // Animation d'erreur sur les inputs
      form.querySelectorAll('input').forEach(input => {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 500);
      });
    }
  });
}

// Redirection selon le rôle
function redirectUser(role) {
  const roleRoutes = {
    'doctor': '/doctor/dashboard',
    'nurse': '/nurse/dashboard',
    'admin': '/admin/dashboard',
    'patient': '/patient/dashboard'
  };

  window.location.href = roleRoutes[role] || '/dashboard';
}

// Animation des inputs au focus
function setupInputAnimations() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');

  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
      input.parentElement.style.transform = 'scale(1)';
    });
  });
}

// Vérification de la session existante
function checkExistingSession() {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  if (token) {
    // Vérifier la validité du token
    fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Token invalide');
        })
        .then(data => {
          redirectUser(data.role);
        })
        .catch(() => {
          // Token invalide, on le supprime
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        });
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setupPasswordToggle();
  setupLoginForm();
  setupInputAnimations();
  checkExistingSession();

  // Animation d'entrée pour les éléments
  const elements = document.querySelectorAll('.form-group, .form-options, .submit-btn');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';

    setTimeout(() => {
      el.style.transition = 'all 0.5s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 * (index + 1));
  });
});