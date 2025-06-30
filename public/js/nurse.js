// Données fictives pour le développement
const mockPatients = [
  { id: 1, firstName: 'Jean', lastName: 'Dupont', age: 45, room: '101', status: 'stable' },
  { id: 2, firstName: 'Marie', lastName: 'Martin', age: 67, room: '102', status: 'attention' },
  { id: 3, firstName: 'Pierre', lastName: 'Bernard', age: 32, room: '103', status: 'stable' },
  { id: 4, firstName: 'Sophie', lastName: 'Dubois', age: 78, room: '104', status: 'critical' },
  { id: 5, firstName: 'Michel', lastName: 'Robert', age: 55, room: '105', status: 'stable' },
  { id: 6, firstName: 'Catherine', lastName: 'Petit', age: 41, room: '106', status: 'attention' },
  { id: 7, firstName: 'Jacques', lastName: 'Moreau', age: 89, room: '107', status: 'stable' },
  { id: 8, firstName: 'Françoise', lastName: 'Laurent', age: 23, room: '108', status: 'stable' }
];

const mockVitalsHistory = [
  {
    patientId: 1,
    patientName: 'Jean Dupont',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    vitals: {
      temperature: 37.2,
      heartRate: 72,
      bloodPressure: '120/80',
      weight: 75,
      oxygenSaturation: 98,
      respiratoryRate: 16
    }
  },
  {
    patientId: 2,
    patientName: 'Marie Martin',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    vitals: {
      temperature: 38.5,
      heartRate: 95,
      bloodPressure: '140/90',
      weight: 68,
      oxygenSaturation: 95,
      respiratoryRate: 20
    }
  }
];

// État de l'application
let currentPatients = [...mockPatients];
let vitalsHistory = [...mockVitalsHistory];
let selectedPatient = null;

// Utilitaires
const showToast = (message, type = 'success') => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconMap = {
    success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };

  toast.innerHTML = `
    <div class="toast-icon">${iconMap[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : 'Information'}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Gestion des onglets
const setupTabs = () => {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.content-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Mettre à jour les onglets actifs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Afficher la section correspondante
      sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${targetTab}-section`) {
          section.classList.add('active');

          // Charger les données si nécessaire
          if (targetTab === 'patients') {
            loadPatients();
          } else if (targetTab === 'history') {
            loadHistory();
          }
        }
      });
    });
  });
};

// Recherche de patients avec autocomplétion
const setupPatientSearch = () => {
  const searchInput = document.getElementById('patient-search');
  const suggestionsDiv = document.getElementById('patient-suggestions');
  const patientSelect = document.getElementById('patient-select');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    if (query.length < 2) {
      suggestionsDiv.classList.remove('active');
      return;
    }

    const filtered = currentPatients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(query)
    );

    if (filtered.length > 0) {
      suggestionsDiv.innerHTML = filtered.map(patient => `
        <div class="patient-item" data-id="${patient.id}">
          <div class="patient-name">${patient.firstName} ${patient.lastName}</div>
          <div class="patient-info">Chambre ${patient.room} • ${patient.age} ans</div>
        </div>
      `).join('');

      suggestionsDiv.classList.add('active');

      // Gérer la sélection
      suggestionsDiv.querySelectorAll('.patient-item').forEach(item => {
        item.addEventListener('click', () => {
          const patientId = parseInt(item.dataset.id);
          const patient = currentPatients.find(p => p.id === patientId);

          selectedPatient = patient;
          searchInput.value = `${patient.firstName} ${patient.lastName}`;
          patientSelect.value = patient.id;
          suggestionsDiv.classList.remove('active');
        });
      });
    } else {
      suggestionsDiv.innerHTML = '<div class="patient-item">Aucun patient trouvé</div>';
      suggestionsDiv.classList.add('active');
    }
  });

  // Fermer les suggestions au clic ailleurs
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.patient-selector')) {
      suggestionsDiv.classList.remove('active');
    }
  });
};

// Charger la liste des patients
const loadPatients = async () => {
  const container = document.getElementById('patients-list-container');

  // Simuler un chargement
  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Chargement des patients...</p></div>';

  setTimeout(() => {
    const tableHTML = `
      <table class="patients-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Chambre</th>
            <th>Âge</th>
            <th>État</th>
            <th>Dernières mesures</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${currentPatients.map(patient => {
      const lastVital = vitalsHistory.find(v => v.patientId === patient.id);
      return `
              <tr>
                <td>
                  <div class="patient-cell">
                    <div class="patient-avatar">${patient.firstName[0]}${patient.lastName[0]}</div>
                    <div class="patient-details">
                      <span class="name">${patient.firstName} ${patient.lastName}</span>
                      <span class="id">ID: ${patient.id.toString().padStart(6, '0')}</span>
                    </div>
                  </div>
                </td>
                <td>${patient.room}</td>
                <td>${patient.age} ans</td>
                <td>
                  <span class="status-badge ${patient.status}">
                    ${patient.status === 'stable' ? '✓ Stable' :
          patient.status === 'attention' ? '⚠ Attention' :
              '⚡ Critique'}
                  </span>
                </td>
                <td class="last-vitals">
                  ${lastVital ? `Il y a ${getTimeAgo(lastVital.timestamp)}` : 'Aucune mesure'}
                </td>
                <td>
                  <div class="table-actions">
                    <button class="btn-table" onclick="selectPatientForVitals(${patient.id})">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                      </svg>
                      Mesurer
                    </button>
                    <button class="btn-table" onclick="viewPatientHistory(${patient.id})">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      </svg>
                      Historique
                    </button>
                  </div>
                </td>
              </tr>
            `;
    }).join('')}
        </tbody>
      </table>
    `;

    container.innerHTML = tableHTML;
  }, 500);
};

// Sélectionner un patient pour les mesures
window.selectPatientForVitals = (patientId) => {
  const patient = currentPatients.find(p => p.id === patientId);
  if (patient) {
    selectedPatient = patient;
    document.getElementById('patient-search').value = `${patient.firstName} ${patient.lastName}`;
    document.getElementById('patient-select').value = patient.id;

    // Basculer vers l'onglet des signes vitaux
    document.querySelector('[data-tab="vitals"]').click();

    showToast(`Patient ${patient.firstName} ${patient.lastName} sélectionné`, 'info');
  }
};

// Afficher l'historique d'un patient
window.viewPatientHistory = (patientId) => {
  // Filtrer l'historique pour ce patient
  const patient = currentPatients.find(p => p.id === patientId);
  if (patient) {
    // Basculer vers l'onglet historique avec filtre
    document.querySelector('[data-tab="history"]').click();
    showToast(`Affichage de l'historique de ${patient.firstName} ${patient.lastName}`, 'info');
  }
};

// Charger l'historique
const loadHistory = () => {
  const container = document.getElementById('history-container');
  const filterPeriod = document.getElementById('filter-period').value;

  // Filtrer selon la période
  let filtered = [...vitalsHistory];
  const now = new Date();

  switch (filterPeriod) {
    case 'today':
      filtered = filtered.filter(v =>
          v.timestamp.toDateString() === now.toDateString()
      );
      break;
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(v => v.timestamp >= weekAgo);
      break;
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(v => v.timestamp >= monthAgo);
      break;
  }

  // Trier par date décroissante
  filtered.sort((a, b) => b.timestamp - a.timestamp);

  if (filtered.length === 0) {
    container.innerHTML = '<div class="loading"><p>Aucune mesure pour cette période</p></div>';
    return;
  }

  container.innerHTML = filtered.map(record => `
    <div class="history-item">
      <div class="history-header">
        <div class="history-patient">
          <div class="patient-avatar">${record.patientName.split(' ').map(n => n[0]).join('')}</div>
          <div>
            <div class="patient-name">${record.patientName}</div>
            <div class="history-time">${formatDateTime(record.timestamp)}</div>
          </div>
        </div>
      </div>
      <div class="history-vitals">
        <div class="vital-reading">
          <span class="vital-label">Température</span>
          <span class="vital-value">${record.vitals.temperature}°C</span>
        </div>
        <div class="vital-reading">
          <span class="vital-label">Fréq. Cardiaque</span>
          <span class="vital-value">${record.vitals.heartRate} bpm</span>
        </div>
        <div class="vital-reading">
          <span class="vital-label">Tension</span>
          <span class="vital-value">${record.vitals.bloodPressure}</span>
        </div>
        <div class="vital-reading">
          <span class="vital-label">Poids</span>
          <span class="vital-value">${record.vitals.weight} kg</span>
        </div>
        <div class="vital-reading">
          <span class="vital-label">Saturation O₂</span>
          <span class="vital-value">${record.vitals.oxygenSaturation}%</span>
        </div>
        <div class="vital-reading">
          <span class="vital-label">Fréq. Respiratoire</span>
          <span class="vital-value">${record.vitals.respiratoryRate} rpm</span>
        </div>
      </div>
    </div>
  `).join('');
};

// Gestion du formulaire
const setupVitalsForm = () => {
  const form = document.getElementById('vitals-form');
  const resetBtn = document.getElementById('reset-form');

  // Remplir le select des patients
  const select = document.getElementById('patient-select');
  currentPatients.forEach(patient => {
    const option = document.createElement('option');
    option.value = patient.id;
    option.textContent = `${patient.firstName} ${patient.lastName}`;
    select.appendChild(option);
  });

  // Soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedPatient && !select.value) {
      showToast('Veuillez sélectionner un patient', 'error');
      return;
    }

    const formData = new FormData(form);
    const vitalsData = {
      patient_id: selectedPatient?.id || select.value,
      temperature: parseFloat(formData.get('temperature')),
      heart_rate: parseInt(formData.get('heart_rate')),
      blood_pressure: formData.get('blood_pressure'),
      weight: parseFloat(formData.get('weight')),
      oxygen_saturation: parseInt(formData.get('oxygen_saturation')),
      respiratory_rate: parseInt(formData.get('respiratory_rate')),
      notes: formData.get('notes')
    };

    // Validation des données
    if (!validateVitals(vitalsData)) {
      return;
    }

    // Simuler l'envoi
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ajouter à l'historique
      const patient = currentPatients.find(p => p.id == vitalsData.patient_id);
      vitalsHistory.unshift({
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        timestamp: new Date(),
        vitals: {
          temperature: vitalsData.temperature,
          heartRate: vitalsData.heart_rate,
          bloodPressure: vitalsData.blood_pressure,
          weight: vitalsData.weight,
          oxygenSaturation: vitalsData.oxygen_saturation,
          respiratoryRate: vitalsData.respiratory_rate
        }
      });

      showToast('Signes vitaux enregistrés avec succès');
      form.reset();
      selectedPatient = null;
      document.getElementById('patient-search').value = '';

    } catch (error) {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = btnText;
    }
  });

  // Bouton reset
  resetBtn.addEventListener('click', () => {
    form.reset();
    selectedPatient = null;
    document.getElementById('patient-search').value = '';
    showToast('Formulaire réinitialisé', 'info');
  });
};

// Validation des données vitales
const validateVitals = (data) => {
  const ranges = {
    temperature: { min: 35, max: 42, name: 'Température' },
    heart_rate: { min: 40, max: 200, name: 'Fréquence cardiaque' },
    oxygen_saturation: { min: 70, max: 100, name: 'Saturation en oxygène' },
    respiratory_rate: { min: 8, max: 40, name: 'Fréquence respiratoire' },
    weight: { min: 1, max: 300, name: 'Poids' }
  };

  for (const [key, range] of Object.entries(ranges)) {
    const value = data[key];
    if (value < range.min || value > range.max) {
      showToast(`${range.name} hors limites (${range.min}-${range.max})`, 'error');
      return false;
    }
  }

  // Validation tension artérielle
  const bpPattern = /^\d{2,3}\/\d{2,3}$/;
  if (!bpPattern.test(data.blood_pressure)) {
    showToast('Format de tension artérielle invalide (ex: 120/80)', 'error');
    return false;
  }

  return true;
};

// Utilitaires de formatage
const formatDateTime = (date) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('fr-FR', options);
};

const getTimeAgo = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

// Recherche dans la liste des patients
const setupPatientListSearch = () => {
  const searchInput = document.getElementById('search-patients');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.patients-table tbody tr');

    rows.forEach(row => {
      const patientName = row.querySelector('.patient-details .name').textContent.toLowerCase();
      const room = row.cells[1].textContent.toLowerCase();

      if (patientName.includes(query) || room.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
};

// Actualiser la liste des patients
const setupRefreshButton = () => {
  const refreshBtn = document.getElementById('refresh-patients');

  refreshBtn.addEventListener('click', () => {
    const icon = refreshBtn.querySelector('svg');
    icon.style.animation = 'spin 1s linear';

    loadPatients();

    setTimeout(() => {
      icon.style.animation = '';
      showToast('Liste des patients actualisée', 'success');
    }, 1000);
  });
};

// Gestion de la déconnexion
const setupLogout = () => {
  const logoutBtn = document.getElementById('logout-button');

  logoutBtn.addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Supprimer les tokens
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      // Animation de déconnexion
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 300);
    }
  });
};

// Gestion du filtre d'historique
const setupHistoryFilter = () => {
  const filterSelect = document.getElementById('filter-period');

  filterSelect.addEventListener('change', () => {
    loadHistory();
  });
};

// Animation des valeurs vitales lors de la saisie
const setupVitalInputAnimations = () => {
  const vitalInputs = document.querySelectorAll('.vital-card input');

  vitalInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const card = e.target.closest('.vital-card');
      const value = parseFloat(e.target.value);

      // Vérifier si la valeur est dans les limites normales
      const min = parseFloat(e.target.min);
      const max = parseFloat(e.target.max);

      if (value && (value < min || value > max)) {
        card.style.borderColor = 'var(--danger)';
        card.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
      } else {
        card.style.borderColor = '';
        card.style.backgroundColor = '';
      }
    });

    // Animation au focus
    input.addEventListener('focus', () => {
      const card = input.closest('.vital-card');
      card.style.transform = 'scale(1.02)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });

    input.addEventListener('blur', () => {
      const card = input.closest('.vital-card');
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
};

// Raccourcis clavier
const setupKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S pour sauvegarder
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      const activeSection = document.querySelector('.content-section.active');
      if (activeSection.id === 'vitals-section') {
        document.getElementById('vitals-form').requestSubmit();
      }
    }

    // Ctrl/Cmd + R pour réinitialiser
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      const activeSection = document.querySelector('.content-section.active');
      if (activeSection.id === 'vitals-section') {
        document.getElementById('reset-form').click();
      }
    }

    // Alt + 1/2/3 pour changer d'onglet
    if (e.altKey) {
      switch (e.key) {
        case '1':
          document.querySelector('[data-tab="vitals"]').click();
          break;
        case '2':
          document.querySelector('[data-tab="patients"]').click();
          break;
        case '3':
          document.querySelector('[data-tab="history"]').click();
          break;
      }
    }
  });
};

// Vérification de l'authentification
const checkAuth = async () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

 /* if (!token) {
    window.location.href = '/login.html';
    return;
  } */

  // En production, vérifier le token avec l'API
  // try {
  //   const response = await fetch('/api/auth/verify', {
  //     headers: { 'Authorization': `Bearer ${token}` }
  //   });
  //   if (!response.ok) throw new Error('Token invalide');
  // } catch (error) {
  //   localStorage.removeItem('authToken');
  //   sessionStorage.removeItem('authToken');
  //   window.location.href = '/login.html';
  // }
};

// Génération de données supplémentaires pour la démo
const generateMoreHistory = () => {
  const patients = currentPatients.slice(0, 5);
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const hoursAgo = Math.floor(Math.random() * 72);

    vitalsHistory.push({
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
      vitals: {
        temperature: 36.5 + Math.random() * 2,
        heartRate: 60 + Math.floor(Math.random() * 40),
        bloodPressure: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
        weight: 60 + Math.floor(Math.random() * 30),
        oxygenSaturation: 95 + Math.floor(Math.random() * 5),
        respiratoryRate: 14 + Math.floor(Math.random() * 8)
      }
    });
  }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async () => {
  // Vérifier l'authentification
  await checkAuth();

  // Générer plus de données pour la démo
  generateMoreHistory();

  // Initialiser les composants
  setupTabs();
  setupPatientSearch();
  setupVitalsForm();
  setupRefreshButton();
  setupLogout();
  setupHistoryFilter();
  setupVitalInputAnimations();
  setupKeyboardShortcuts();

  // Charger les patients initiaux
  loadPatients();

  // Observer les changements de recherche dans la liste
  const observer = new MutationObserver(() => {
    const searchInput = document.getElementById('search-patients');
    if (searchInput && !searchInput.hasAttribute('data-initialized')) {
      searchInput.setAttribute('data-initialized', 'true');
      setupPatientListSearch();
    }
  });

  observer.observe(document.getElementById('patients-list-container'), {
    childList: true,
    subtree: true
  });

  // Message de bienvenue
  showToast('Bienvenue dans l\'espace infirmier', 'success');
});