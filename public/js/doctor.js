// Données fictives cohérentes avec l'interface infirmier
const mockPatients = [
  { id: 1, firstName: 'Jean', lastName: 'Dupont', age: 45, room: '101', status: 'stable', visitsLastMonth: 3 },
  { id: 2, firstName: 'Marie', lastName: 'Martin', age: 67, room: '102', status: 'attention', visitsLastMonth: 5 },
  { id: 3, firstName: 'Pierre', lastName: 'Bernard', age: 32, room: '103', status: 'stable', visitsLastMonth: 1 },
  { id: 4, firstName: 'Sophie', lastName: 'Dubois', age: 78, room: '104', status: 'critical', visitsLastMonth: 8 },
  { id: 5, firstName: 'Michel', lastName: 'Robert', age: 55, room: '105', status: 'stable', visitsLastMonth: 2 },
  { id: 6, firstName: 'Catherine', lastName: 'Petit', age: 41, room: '106', status: 'attention', visitsLastMonth: 4 },
  { id: 7, firstName: 'Jacques', lastName: 'Moreau', age: 89, room: '107', status: 'stable', visitsLastMonth: 6 },
  { id: 8, firstName: 'Françoise', lastName: 'Laurent', age: 23, room: '108', status: 'stable', visitsLastMonth: 1 }
];

// Données des signes vitaux (cohérentes avec nurse.js)
const mockVitalsData = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Jean Dupont',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nurse: 'Marie Dupont',
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
    id: 2,
    patientId: 2,
    patientName: 'Marie Martin',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    nurse: 'Marie Dupont',
    vitals: {
      temperature: 38.5,
      heartRate: 95,
      bloodPressure: '140/90',
      weight: 68,
      oxygenSaturation: 95,
      respiratoryRate: 20
    }
  },
  {
    id: 3,
    patientId: 4,
    patientName: 'Sophie Dubois',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    nurse: 'Marie Dupont',
    vitals: {
      temperature: 39.2,
      heartRate: 110,
      bloodPressure: '150/95',
      weight: 72,
      oxygenSaturation: 92,
      respiratoryRate: 24
    }
  }
];

// Historique des consultations
const mockConsultations = [
  {
    id: 1,
    patientId: 2,
    patientName: 'Marie Martin',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    chiefComplaint: 'Douleurs thoraciques',
    diagnosis: 'Angine de poitrine',
    observations: 'Patiente présentant des douleurs thoraciques à l\'effort. ECG normal au repos.',
    recommendations: 'Repos, éviter les efforts importants. Surveillance cardiologique recommandée.',
    prescriptions: [
      { medication: 'Aspirine', dosage: '100mg', duration: '1 fois/jour - 3 mois' },
      { medication: 'Trinitrine', dosage: '0.15mg', duration: 'Si douleur' }
    ],
    followUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    patientId: 4,
    patientName: 'Sophie Dubois',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    chiefComplaint: 'Fièvre persistante et toux',
    diagnosis: 'Pneumonie',
    observations: 'Fièvre élevée depuis 3 jours, toux productive. Auscultation : râles crépitants base droite.',
    recommendations: 'Hospitalisation recommandée pour surveillance. Radiographie pulmonaire à refaire dans 48h.',
    prescriptions: [
      { medication: 'Amoxicilline', dosage: '1g', duration: '3 fois/jour - 7 jours' },
      { medication: 'Paracétamol', dosage: '1g', duration: '4 fois/jour si fièvre' }
    ]
  }
];

// État de l'application
let currentPatients = [...mockPatients];
let vitalsData = [...mockVitalsData];
let consultations = [...mockConsultations];
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

// Formatage des dates
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

const formatDate = (date) => {
  return date.toLocaleDateString('fr-FR');
};

const getTimeAgo = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
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
          switch(targetTab) {
            case 'dashboard':
              loadDashboard();
              break;
            case 'vitals':
              loadVitals();
              break;
            case 'history':
              loadConsultationHistory();
              break;
          }
        }
      });
    });
  });
};

// Charger le tableau de bord
const loadDashboard = () => {
  // Charger les patients récents
  const recentPatientsContainer = document.getElementById('recent-patients-list');
  const recentPatients = currentPatients
      .filter(p => p.status === 'critical' || p.status === 'attention')
      .slice(0, 5);

  recentPatientsContainer.innerHTML = `
    <div class="patients-list">
      ${recentPatients.map(patient => {
    const lastVital = vitalsData.find(v => v.patientId === patient.id);
    return `
          <div class="patient-item-dashboard">
            <div class="patient-info">
              <div class="patient-name">${patient.firstName} ${patient.lastName}</div>
              <div class="patient-details">Chambre ${patient.room} • ${patient.age} ans</div>
            </div>
            <div class="patient-status">
              <span class="status-badge ${patient.status}">
                ${patient.status === 'critical' ? 'Critique' : 'Attention'}
              </span>
            </div>
            <button class="btn-view-patient" onclick="viewPatientDetails(${patient.id})">
              Voir
            </button>
          </div>
        `;
  }).join('')}
    </div>
  `;

  // Charger les alertes
  const alertsContainer = document.getElementById('alerts-list');
  const alerts = [];

  // Générer des alertes basées sur les signes vitaux
  vitalsData.forEach(vital => {
    const patient = currentPatients.find(p => p.id === vital.patientId);
    if (vital.vitals.temperature > 38.5) {
      alerts.push({
        type: 'critical',
        message: `${patient.firstName} ${patient.lastName} - Température élevée: ${vital.vitals.temperature}°C`,
        time: vital.timestamp
      });
    }
    if (vital.vitals.oxygenSaturation < 95) {
      alerts.push({
        type: 'warning',
        message: `${patient.firstName} ${patient.lastName} - Saturation O₂ faible: ${vital.vitals.oxygenSaturation}%`,
        time: vital.timestamp
      });
    }
  });

  alertsContainer.innerHTML = alerts.length > 0 ? alerts.map(alert => `
    <div class="alert-item ${alert.type}">
      <div class="alert-icon">
        ${alert.type === 'critical' ? '⚠️' : 'ℹ️'}
      </div>
      <div class="alert-content">
        <div class="alert-message">${alert.message}</div>
        <div class="alert-time">${getTimeAgo(alert.time)}</div>
      </div>
    </div>
  `).join('') : '<p class="no-alerts">Aucune alerte active</p>';

  // Mettre à jour les statistiques
  updateDashboardStats();
};

// Mettre à jour les statistiques du tableau de bord
const updateDashboardStats = () => {
  const period = document.getElementById('dashboard-period').value;

  // Calculer les stats selon la période
  let consultationCount = consultations.length;
  let criticalCount = currentPatients.filter(p => p.status === 'critical').length;
  let vitalsCount = vitalsData.length;

  // Mettre à jour l'affichage
  document.querySelector('.patients-total .stat-value').textContent = currentPatients.length;
  document.querySelector('.consultations .stat-value').textContent = consultationCount;
  document.querySelector('.critical-patients .stat-value').textContent = criticalCount;
  document.querySelector('.avg-vitals .stat-value').textContent = vitalsCount;
};

// Charger les signes vitaux
const loadVitals = () => {
  const container = document.getElementById('vitals-container');
  const searchTerm = document.getElementById('search-vitals').value.toLowerCase();
  const filterStatus = document.getElementById('filter-status').value;

  // Filtrer les patients
  let filteredPatients = currentPatients;

  if (searchTerm) {
    filteredPatients = filteredPatients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm)
    );
  }

  if (filterStatus !== 'all') {
    filteredPatients = filteredPatients.filter(p => p.status === filterStatus);
  }

  container.innerHTML = filteredPatients.map(patient => {
    const patientVitals = vitalsData.filter(v => v.patientId === patient.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (!patientVitals) {
      return `
        <div class="patient-vitals-card">
          <div class="vitals-header">
            <div class="patient-info-vitals">
              <div class="vitals-patient-avatar">${patient.firstName[0]}${patient.lastName[0]}</div>
              <div>
                <div class="patient-name">${patient.firstName} ${patient.lastName}</div>
                <div class="patient-details">Chambre ${patient.room} • ${patient.age} ans</div>
              </div>
            </div>
          </div>
          <p class="no-vitals">Aucun signe vital enregistré</p>
        </div>
      `;
    }

    return `
      <div class="patient-vitals-card">
        <div class="vitals-header">
          <div class="patient-info-vitals">
            <div class="vitals-patient-avatar">${patient.firstName[0]}${patient.lastName[0]}</div>
            <div>
              <div class="patient-name">${patient.firstName} ${patient.lastName}</div>
              <div class="patient-details">Chambre ${patient.room} • ${patient.age} ans</div>
              <div class="vitals-time">${getTimeAgo(patientVitals.timestamp)} par ${patientVitals.nurse}</div>
            </div>
          </div>
          <span class="vitals-status ${patient.status}">
            ${patient.status === 'stable' ? '✓ Stable' :
        patient.status === 'attention' ? '⚠ Attention' :
            '⚡ Critique'}
          </span>
        </div>
        <div class="vitals-readings">
          <div class="vital-item ${patientVitals.vitals.temperature > 38 ? 'alert' : ''}">
            <span class="vital-label">Température</span>
            <span class="vital-value">${patientVitals.vitals.temperature}<span class="vital-unit">°C</span></span>
          </div>
          <div class="vital-item">
            <span class="vital-label">Fréq. Cardiaque</span>
            <span class="vital-value">${patientVitals.vitals.heartRate}<span class="vital-unit">bpm</span></span>
          </div>
          <div class="vital-item">
            <span class="vital-label">Tension</span>
            <span class="vital-value">${patientVitals.vitals.bloodPressure}</span>
          </div>
          <div class="vital-item">
            <span class="vital-label">Poids</span>
            <span class="vital-value">${patientVitals.vitals.weight}<span class="vital-unit">kg</span></span>
          </div>
          <div class="vital-item ${patientVitals.vitals.oxygenSaturation < 95 ? 'alert' : ''}">
            <span class="vital-label">Saturation O₂</span>
            <span class="vital-value">${patientVitals.vitals.oxygenSaturation}<span class="vital-unit">%</span></span>
          </div>
          <div class="vital-item">
            <span class="vital-label">Fréq. Resp.</span>
            <span class="vital-value">${patientVitals.vitals.respiratoryRate}<span class="vital-unit">rpm</span></span>
          </div>
        </div>
        <div class="vitals-actions">
          <button class="btn-secondary" onclick="startConsultation(${patient.id})">
            Nouvelle consultation
          </button>
        </div>
      </div>
    `;
  }).join('');
};

// Recherche de patients pour consultation
const setupPatientSearchConsult = () => {
  const searchInput = document.getElementById('patient-search-consult');
  const suggestionsDiv = document.getElementById('patient-suggestions-consult');
  const patientSelect = document.getElementById('patient-select-consult');

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
          <div class="patient-info">Chambre ${patient.room} • ${patient.age} ans • ${patient.status === 'stable' ? 'Stable' : patient.status === 'attention' ? 'Attention' : 'Critique'}</div>
        </div>
      `).join('');

      suggestionsDiv.classList.add('active');

      // Gérer la sélection
      suggestionsDiv.querySelectorAll('.patient-item').forEach(item => {
        item.addEventListener('click', () => {
          const patientId = parseInt(item.dataset.id);
          selectPatientForConsultation(patientId);
          suggestionsDiv.classList.remove('active');
        });
      });
    }
  });

  // Fermer les suggestions au clic ailleurs
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.patient-selector')) {
      suggestionsDiv.classList.remove('active');
    }
  });
};

// Sélectionner un patient pour consultation
const selectPatientForConsultation = (patientId) => {
  const patient = currentPatients.find(p => p.id === patientId);
  if (patient) {
    selectedPatient = patient;
    document.getElementById('patient-search-consult').value = `${patient.firstName} ${patient.lastName}`;
    document.getElementById('patient-select-consult').value = patient.id;

    // Afficher les derniers signes vitaux
    displayPatientVitals(patient.id);
  }
};

// Afficher les signes vitaux du patient sélectionné
const displayPatientVitals = (patientId) => {
  const display = document.getElementById('patient-vitals-display');
  const patientVitals = vitalsData.filter(v => v.patientId === patientId)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

  if (patientVitals) {
    display.querySelector('.vitals-summary').innerHTML = `
      <div class="vital-item">
        <span class="vital-label">Temp.</span>
        <span class="vital-value">${patientVitals.vitals.temperature}°C</span>
      </div>
      <div class="vital-item">
        <span class="vital-label">FC</span>
        <span class="vital-value">${patientVitals.vitals.heartRate} bpm</span>
      </div>
      <div class="vital-item">
        <span class="vital-label">TA</span>
        <span class="vital-value">${patientVitals.vitals.bloodPressure}</span>
      </div>
      <div class="vital-item">
        <span class="vital-label">SaO₂</span>
        <span class="vital-value">${patientVitals.vitals.oxygenSaturation}%</span>
      </div>
      <div class="vital-item">
        <span class="vital-label">Mesure</span>
        <span class="vital-value">${getTimeAgo(patientVitals.timestamp)}</span>
      </div>
    `;
    display.style.display = 'block';
  } else {
    display.style.display = 'none';
  }
};

// Gestion des prescriptions
const setupPrescriptions = () => {
  const addBtn = document.getElementById('add-prescription');
  const container = document.getElementById('prescriptions-container');
  let prescriptionCount = 1; // Compteur pour les IDs uniques

  addBtn.addEventListener('click', () => {
    const newItem = document.createElement('div');
    newItem.className = 'prescription-item';
    newItem.innerHTML = `
      <input 
        type="text" 
        name="medication[]" 
        placeholder="Médicament" 
        class="medication-input"
        id="medication-${prescriptionCount}"
        aria-label="Médicament"
      >
      <input 
        type="text" 
        name="dosage[]" 
        placeholder="Dosage" 
        class="dosage-input"
        id="dosage-${prescriptionCount}"
        aria-label="Dosage"
      >
      <input 
        type="text" 
        name="duration[]" 
        placeholder="Durée" 
        class="duration-input"
        id="duration-${prescriptionCount}"
        aria-label="Durée"
      >
      <button type="button" class="btn-remove-prescription" aria-label="Supprimer cette prescription">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    container.appendChild(newItem);
    prescriptionCount++;

    // Gérer la suppression
    newItem.querySelector('.btn-remove-prescription').addEventListener('click', () => {
      newItem.remove();
    });
  });

  // Gérer la suppression pour le premier élément
  document.querySelectorAll('.btn-remove-prescription').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.prescription-item').remove();
    });
  });
};

// Gestion du formulaire de consultation
const setupConsultationForm = () => {
  const form = document.getElementById('consultation-form');
  const resetBtn = document.getElementById('reset-consultation');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      showToast('Veuillez sélectionner un patient', 'error');
      return;
    }

    const formData = new FormData(form);

    // Collecter les prescriptions
    const medications = formData.getAll('medication[]');
    const dosages = formData.getAll('dosage[]');
    const durations = formData.getAll('duration[]');

    const prescriptions = medications
        .map((med, i) => ({
          medication: med,
          dosage: dosages[i],
          duration: durations[i]
        }))
        .filter(p => p.medication); // Filtrer les prescriptions vides

    const consultationData = {
      patient_id: selectedPatient.id,
      chief_complaint: formData.get('chief_complaint'),
      observations: formData.get('observations'),
      diagnosis: formData.get('diagnosis'),
      recommendations: formData.get('recommendations'),
      prescriptions: prescriptions,
      follow_up: formData.get('follow_up')
    };

    // Simuler l'envoi
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ajouter la consultation à l'historique
      consultations.unshift({
        id: consultations.length + 1,
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        date: new Date(),
        chiefComplaint: consultationData.chief_complaint,
        diagnosis: consultationData.diagnosis,
        observations: consultationData.observations,
        recommendations: consultationData.recommendations,
        prescriptions: consultationData.prescriptions,
        followUp: consultationData.follow_up ? new Date(consultationData.follow_up) : null
      });

      showToast('Consultation enregistrée avec succès');
      form.reset();
      selectedPatient = null;
      document.getElementById('patient-vitals-display').style.display = 'none';

    } catch (error) {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = btnText;
    }
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    selectedPatient = null;
    document.getElementById('patient-search-consult').value = '';
    document.getElementById('patient-vitals-display').style.display = 'none';
    showToast('Formulaire réinitialisé', 'info');
  });
};

// Charger l'historique des consultations
const loadConsultationHistory = () => {
  const container = document.getElementById('history-container');
  const searchTerm = document.getElementById('search-history').value.toLowerCase();
  const filterPeriod = document.getElementById('filter-history-period').value;

  let filtered = [...consultations];

  // Filtrer par recherche
  if (searchTerm) {
    filtered = filtered.filter(c =>
        c.patientName.toLowerCase().includes(searchTerm) ||
        c.diagnosis.toLowerCase().includes(searchTerm) ||
        c.chiefComplaint.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrer par période
  const now = new Date();
  switch (filterPeriod) {
    case 'today':
      filtered = filtered.filter(c => c.date.toDateString() === now.toDateString());
      break;
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(c => c.date >= weekAgo);
      break;
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(c => c.date >= monthAgo);
      break;
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results">Aucune consultation trouvée</div>';
    return;
  }

  container.innerHTML = filtered.map(consultation => `
    <div class="consultation-card">
      <div class="consultation-header">
        <div class="patient-info">
          <h4>${consultation.patientName}</h4>
          <div class="consultation-date">${formatDateTime(consultation.date)}</div>
        </div>
        <button class="btn-secondary" onclick="printConsultation(${consultation.id})">
          Imprimer
        </button>
      </div>
      <div class="consultation-content">
        <div class="consultation-section">
          <h4>Motif de consultation</h4>
          <p>${consultation.chiefComplaint}</p>
        </div>
        <div class="consultation-section">
          <h4>Diagnostic</h4>
          <p>${consultation.diagnosis}</p>
        </div>
        <div class="consultation-section">
          <h4>Observations</h4>
          <p>${consultation.observations}</p>
        </div>
        ${consultation.recommendations ? `
          <div class="consultation-section">
            <h4>Recommandations</h4>
            <p>${consultation.recommendations}</p>
          </div>
        ` : ''}
        ${consultation.prescriptions.length > 0 ? `
          <div class="consultation-section">
            <h4>Prescriptions</h4>
            <ul>
              ${consultation.prescriptions.map(p =>
      `<li>${p.medication} - ${p.dosage} - ${p.duration}</li>`
  ).join('')}
            </ul>
          </div>
        ` : ''}
        ${consultation.followUp ? `
          <div class="consultation-section">
            <h4>Prochain RDV</h4>
            <p>${formatDate(consultation.followUp)}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
};

// Actions globales
window.viewPatientDetails = (patientId) => {
  document.querySelector('[data-tab="vitals"]').click();
  setTimeout(() => {
    const patient = currentPatients.find(p => p.id === patientId);
    document.getElementById('search-vitals').value = `${patient.firstName} ${patient.lastName}`;
    loadVitals();
  }, 100);
};

window.startConsultation = (patientId) => {
  document.querySelector('[data-tab="consultation"]').click();
  setTimeout(() => {
    selectPatientForConsultation(patientId);
  }, 100);
};

window.printConsultation = (consultationId) => {
  const consultation = consultations.find(c => c.id === consultationId);
  if (consultation) {
    showToast('Fonction d\'impression en cours de développement', 'info');
  }
};

// Gestion de la déconnexion
const setupLogout = () => {
  const logoutBtn = document.getElementById('logout-button');

  logoutBtn.addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 300);
    }
  });
};

// Recherche dans les listes
const setupSearchInputs = () => {
  // Recherche signes vitaux
  document.getElementById('search-vitals').addEventListener('input', () => {
    loadVitals();
  });

  // Filtre status
  document.getElementById('filter-status').addEventListener('change', () => {
    loadVitals();
  });

  // Recherche historique
  document.getElementById('search-history').addEventListener('input', () => {
    loadConsultationHistory();
  });

  // Filtre période historique
  document.getElementById('filter-history-period').addEventListener('change', () => {
    loadConsultationHistory();
  });

  // Période tableau de bord
  document.getElementById('dashboard-period').addEventListener('change', () => {
    updateDashboardStats();
  });
};

// Générer plus de données pour la démo
const generateMoreData = () => {
  // Ajouter plus de signes vitaux
  const nurses = ['Marie Dupont', 'Sophie Martin', 'Claire Bernard'];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const patient = currentPatients[Math.floor(Math.random() * currentPatients.length)];
    const hoursAgo = Math.floor(Math.random() * 48);

    vitalsData.push({
      id: vitalsData.length + 1,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
      nurse: nurses[Math.floor(Math.random() * nurses.length)],
      vitals: {
        temperature: 36.5 + Math.random() * 2.5,
        heartRate: 60 + Math.floor(Math.random() * 40),
        bloodPressure: `${110 + Math.floor(Math.random() * 40)}/${70 + Math.floor(Math.random() * 20)}`,
        weight: patient.id === 1 ? 75 : 60 + Math.floor(Math.random() * 30),
        oxygenSaturation: 92 + Math.floor(Math.random() * 8),
        respiratoryRate: 14 + Math.floor(Math.random() * 10)
      }
    });
  }
};

// Vérification de l'authentification
const checkAuth = async () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  /*if (!token) {
    window.location.href = '/login.html';
    return;
  }*/
};

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();

  // Générer plus de données
  generateMoreData();

  // Initialiser les composants
  setupTabs();
  setupPatientSearchConsult();
  setupPrescriptions();
  setupConsultationForm();
  setupLogout();
  setupSearchInputs();

  // Charger le tableau de bord initial
  loadDashboard();

  // Message de bienvenue
  showToast('Bienvenue Dr. Martin', 'success');
});