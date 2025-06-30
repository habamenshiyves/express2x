// Données du patient connecté (cohérentes avec les autres interfaces)
const currentPatient = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    age: 45,
    room: '101',
    doctor: 'Dr. Jean Martin',
    email: 'jean.dupont@email.com',
    phone: '06 12 34 56 78'
};

// Historique des signes vitaux du patient
const myVitalsHistory = [
    {
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
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
        date: new Date(Date.now() - 26 * 60 * 60 * 1000),
        nurse: 'Sophie Martin',
        vitals: {
            temperature: 36.8,
            heartRate: 68,
            bloodPressure: '118/78',
            weight: 75,
            oxygenSaturation: 99,
            respiratoryRate: 14
        }
    },
    {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nurse: 'Claire Bernard',
        vitals: {
            temperature: 37.0,
            heartRate: 70,
            bloodPressure: '122/82',
            weight: 74.5,
            oxygenSaturation: 98,
            respiratoryRate: 15
        }
    }
];

// Historique des consultations
const myConsultations = [
    {
        id: 1,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        doctor: 'Dr. Jean Martin',
        chiefComplaint: 'Contrôle de routine',
        diagnosis: 'Bonne santé générale',
        observations: 'Patient en bonne forme. Tension et signes vitaux normaux.',
        recommendations: 'Continuer l\'activité physique régulière. Maintenir une alimentation équilibrée.',
        prescriptions: [
            { medication: 'Aspirine', dosage: '100mg', duration: '1 fois/jour - continu' }
        ],
        followUp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
        id: 2,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        doctor: 'Dr. Jean Martin',
        chiefComplaint: 'Douleurs lombaires',
        diagnosis: 'Lombalgie mécanique',
        observations: 'Douleurs lombaires basses sans irradiation. Pas de déficit neurologique.',
        recommendations: 'Repos relatif, éviter les efforts de soulèvement. Kinésithérapie recommandée.',
        prescriptions: [
            { medication: 'Paracétamol', dosage: '1g', duration: '3 fois/jour si douleur - 5 jours' },
            { medication: 'Ibuprofène', dosage: '400mg', duration: '2 fois/jour après repas - 5 jours' }
        ]
    }
];

// Rendez-vous
const myAppointments = [
    {
        id: 1,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '14:30',
        doctor: 'Dr. Jean Martin',
        type: 'Consultation de suivi',
        status: 'confirmed'
    },
    {
        id: 2,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        time: '10:00',
        doctor: 'Dr. Jean Martin',
        type: 'Consultation',
        status: 'completed'
    }
];

// Traitements en cours
const currentTreatments = [
    { medication: 'Aspirine', dosage: '100mg - 1 fois/jour', startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    { medication: 'Metformine', dosage: '500mg - 2 fois/jour', startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
];

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

const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (date) => {
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
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

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetTab}-section`) {
                    section.classList.add('active');

                    // Charger les données si nécessaire
                    switch(targetTab) {
                        case 'vitals':
                            loadVitalsHistory();
                            break;
                        case 'consultations':
                            loadConsultations();
                            break;
                        case 'appointments':
                            loadAppointments();
                            break;
                    }
                }
            });
        });
    });
};

// Charger la vue d'ensemble
const loadOverview = () => {
    // Mettre à jour les informations personnelles
    document.querySelector('.user-name').textContent = `${currentPatient.firstName} ${currentPatient.lastName}`;

    // Derniers signes vitaux
    if (myVitalsHistory.length > 0) {
        const latest = myVitalsHistory[0];
        document.querySelector('.vitals-preview').innerHTML = `
      <div class="vital-mini">
        <span class="vital-icon">🌡️</span>
        <div>
          <span class="vital-label">Température</span>
          <span class="vital-value">${latest.vitals.temperature}°C</span>
        </div>
      </div>
      <div class="vital-mini">
        <span class="vital-icon">❤️</span>
        <div>
          <span class="vital-label">Rythme cardiaque</span>
          <span class="vital-value">${latest.vitals.heartRate} bpm</span>
        </div>
      </div>
      <div class="vital-mini">
        <span class="vital-icon">💉</span>
        <div>
          <span class="vital-label">Tension</span>
          <span class="vital-value">${latest.vitals.bloodPressure}</span>
        </div>
      </div>
      <div class="vital-mini">
        <span class="vital-icon">💨</span>
        <div>
          <span class="vital-label">Saturation O₂</span>
          <span class="vital-value">${latest.vitals.oxygenSaturation}%</span>
        </div>
      </div>
    `;
        document.querySelector('.last-update').textContent = `Dernière mesure : ${getTimeAgo(latest.date)}`;
    }

    // Prochain rendez-vous
    const upcomingAppointments = myAppointments.filter(a => a.date > new Date());
    if (upcomingAppointments.length > 0) {
        const next = upcomingAppointments[0];
        return null}