// PadelFlow - Main Application JavaScript
// State management, wizard logic, and localStorage handling

// Global State
let currentStep = 1;
const maxSteps = 4;
let tournamentData = {
    basicInfo: {},
    format: {},
    prizes: {},
    invitations: {}
};
let selectedCategories = [];

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Navigate to the tournament creation wizard page
 * This function can be called from any page to redirect to create-tournament.html
 */
function startTournamentFlow() {
    window.location.href = "create-tournament.html";
}

function scrollToWizard() {
    // Legacy function - kept for backwards compatibility
    // Now redirects to dedicated tournament creation page
    startTournamentFlow();
}

function updateProgressBar() {
    const progress = (currentStep / maxSteps) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('step-indicator').textContent = `Paso ${currentStep} de ${maxSteps}`;

    const stepNames = ['Datos básicos', 'Formato', 'Premios', 'Vista previa'];
    document.getElementById('step-name').textContent = stepNames[currentStep - 1];
}

// ========================================
// STEP NAVIGATION
// ========================================

function nextStep() {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
        return;
    }

    // Save current step data
    saveStepData(currentStep);

    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.add('hidden');

    // Move to next step
    currentStep++;

    // Show next step
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');

    // Update progress bar
    updateProgressBar();

    // Populate summary if on step 4
    if (currentStep === 4) {
        populateSummary();
    }

    // Scroll to top of wizard
    document.getElementById('wizard').scrollIntoView({ behavior: 'smooth' });
}

function previousStep() {
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.add('hidden');

    // Move to previous step
    currentStep--;

    // Show previous step
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');

    // Update progress bar
    updateProgressBar();

    // Scroll to top of wizard
    document.getElementById('wizard').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// STEP 1: BASIC INFO
// ========================================

function toggleCategory(category) {
    const btn = document.querySelector(`[data-category="${category}"]`);

    if (selectedCategories.includes(category)) {
        // Remove category
        selectedCategories = selectedCategories.filter(c => c !== category);
        btn.classList.remove('bg-primary', 'border-primary', 'text-white');
        btn.classList.add('bg-gray-800', 'border-gray-600');
    } else {
        // Add category
        selectedCategories.push(category);
        btn.classList.add('bg-primary', 'border-primary', 'text-white');
        btn.classList.remove('bg-gray-800', 'border-gray-600');
    }

    document.getElementById('tournament-categories').value = selectedCategories.join(',');
}

function validateStep(step) {
    if (step === 1) {
        // Validate basic info
        const name = document.getElementById('tournament-name').value.trim();
        const location = document.getElementById('tournament-location').value.trim();
        const city = document.getElementById('tournament-city').value.trim();
        const startDate = document.getElementById('tournament-start').value;
        const endDate = document.getElementById('tournament-end').value;

        if (!name || !location || !city || !startDate || !endDate) {
            alert('Por favor, completa todos los campos obligatorios');
            return false;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('La fecha de inicio no puede ser posterior a la fecha de fin');
            return false;
        }

        return true;
    }

    if (step === 2) {
        // Validate format selection
        if (!tournamentData.format.type) {
            alert('Por favor, selecciona un formato de torneo');
            return false;
        }
        return true;
    }

    if (step === 3) {
        // Validate prizes
        const prizeType = tournamentData.prizes.type;

        if (prizeType === 'dinero') {
            const prizePool = document.getElementById('prize-pool').value;
            if (!prizePool || prizePool <= 0) {
                alert('Por favor, ingresa un monto válido para el prize pool');
                return false;
            }
        } else if (prizeType === 'productos') {
            const description = document.getElementById('prize-description').value.trim();
            if (!description) {
                alert('Por favor, describe los premios');
                return false;
            }
        }

        return true;
    }

    return true;
}

function saveStepData(step) {
    if (step === 1) {
        tournamentData.basicInfo = {
            name: document.getElementById('tournament-name').value,
            location: document.getElementById('tournament-location').value,
            city: document.getElementById('tournament-city').value,
            startDate: document.getElementById('tournament-start').value,
            endDate: document.getElementById('tournament-end').value,
            courts: document.getElementById('tournament-courts').value,
            currency: document.getElementById('tournament-currency').value,
            categories: selectedCategories
        };
    } else if (step === 2) {
        // Format data is saved when user selects format
    } else if (step === 3) {
        const prizeType = tournamentData.prizes.type;

        if (prizeType === 'dinero') {
            const distribution = document.getElementById('prize-distribution').value;
            tournamentData.prizes = {
                type: 'dinero',
                amount: document.getElementById('prize-pool').value,
                currency: document.getElementById('tournament-currency').value,
                distribution: distribution === 'custom' ? {
                    first: document.getElementById('first-place').value,
                    second: document.getElementById('second-place').value,
                    third: document.getElementById('third-place').value
                } : distribution,
                organizerWallet: document.getElementById('organizer-wallet').value
            };
        } else {
            tournamentData.prizes = {
                type: 'productos',
                description: document.getElementById('prize-description').value,
                organizerWallet: document.getElementById('organizer-wallet').value
            };
        }
    } else if (step === 4) {
        tournamentData.invitations = {
            link: document.getElementById('invite-link').checked,
            email: document.getElementById('invite-email').checked,
            qr: document.getElementById('invite-qr').checked
        };
    }
}

// ========================================
// STEP 2: FORMAT SELECTION
// ========================================

function selectFormat(formatType) {
    // Remove selection from all format cards
    document.querySelectorAll('.format-card').forEach(card => {
        card.classList.remove('border-primary', 'bg-primary/5');
        card.classList.add('border-gray-600');
        card.querySelector('.format-check').classList.add('hidden');
    });

    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-format="${formatType}"]`);
    selectedCard.classList.add('border-primary', 'bg-primary/5');
    selectedCard.classList.remove('border-gray-600');
    selectedCard.querySelector('.format-check').classList.remove('hidden');

    // Save format type
    tournamentData.format.type = formatType;

    // Show format-specific fields
    showFormatFields(formatType);
}

function showFormatFields(formatType) {
    const container = document.getElementById('format-fields');
    let html = '';

    if (formatType === 'americano') {
        html = `
            <div>
                <label class="block text-sm font-semibold mb-2">Número de jugadores/parejas *</label>
                <input type="number" id="americano-players" min="4" value="16"
                       class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold mb-2">Duración de cada partido (minutos) *</label>
                    <input type="number" id="americano-duration" min="15" step="5" value="20"
                           class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-2">Puntos por victoria *</label>
                    <input type="number" id="americano-win-points" min="1" value="3"
                           class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold mb-2">Puntos por empate *</label>
                    <input type="number" id="americano-draw-points" min="0" value="1"
                           class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-2">Puntos por derrota *</label>
                    <input type="number" id="americano-loss-points" min="0" value="0"
                           class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                </div>
            </div>
        `;

        // Save format data when fields change
        setTimeout(() => {
            tournamentData.format.details = {
                players: document.getElementById('americano-players').value,
                duration: document.getElementById('americano-duration').value,
                winPoints: document.getElementById('americano-win-points').value,
                drawPoints: document.getElementById('americano-draw-points').value,
                lossPoints: document.getElementById('americano-loss-points').value
            };
        }, 100);

    } else if (formatType === 'round-robin') {
        html = `
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold mb-2">Número de parejas *</label>
                    <input type="number" id="roundrobin-teams" min="4" value="16"
                           class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-2">Número de grupos *</label>
                    <input type="number" id="roundrobin-groups" min="2" value="4"
                           class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                </div>
            </div>
            <div>
                <label class="block text-sm font-semibold mb-2">Formato de partidos *</label>
                <select id="roundrobin-match-format"
                        class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="1-set">A un set</option>
                    <option value="2-sets">Mejor de 2 sets</option>
                    <option value="3-sets">Mejor de 3 sets</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-semibold mb-2">Clasificados a cuadro final (por grupo) *</label>
                <input type="number" id="roundrobin-qualifiers" min="1" max="4" value="2"
                       class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
            </div>
        `;

        setTimeout(() => {
            tournamentData.format.details = {
                teams: document.getElementById('roundrobin-teams').value,
                groups: document.getElementById('roundrobin-groups').value,
                matchFormat: document.getElementById('roundrobin-match-format').value,
                qualifiers: document.getElementById('roundrobin-qualifiers').value
            };
        }, 100);

    } else if (formatType === 'eliminacion') {
        html = `
            <div>
                <label class="block text-sm font-semibold mb-2">Número de parejas *</label>
                <select id="eliminacion-teams"
                        class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="8">8 parejas</option>
                    <option value="16" selected>16 parejas</option>
                    <option value="32">32 parejas</option>
                    <option value="64">64 parejas</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-semibold mb-2">Formato de partidos *</label>
                <select id="eliminacion-match-format"
                        class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="3-sets">Mejor de 3 sets</option>
                    <option value="2-sets">Mejor de 2 sets con super tie-break</option>
                    <option value="1-set">Un set + super tie-break</option>
                </select>
            </div>
            <div class="flex items-start gap-3 bg-gray-800 border border-gray-700 rounded-lg p-4">
                <input type="checkbox" id="eliminacion-consolation" class="mt-1">
                <div>
                    <label for="eliminacion-consolation" class="font-semibold cursor-pointer">Incluir cuadro de consolación</label>
                    <p class="text-sm text-gray-400 mt-1">Los perdedores de primera ronda juegan por premios de consolación</p>
                </div>
            </div>
        `;

        setTimeout(() => {
            tournamentData.format.details = {
                teams: document.getElementById('eliminacion-teams').value,
                matchFormat: document.getElementById('eliminacion-match-format').value,
                consolation: document.getElementById('eliminacion-consolation').checked
            };
        }, 100);

    } else if (formatType === 'liga') {
        html = `
            <div>
                <label class="block text-sm font-semibold mb-2">Número de parejas *</label>
                <input type="number" id="liga-teams" min="4" value="12"
                       class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold mb-2">Partidos por semana *</label>
                    <select id="liga-matches-per-week"
                            class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="1">1 partido/semana</option>
                        <option value="2" selected>2 partidos/semana</option>
                        <option value="3">3 partidos/semana</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-semibold mb-2">Duración de la liga (semanas) *</label>
                    <input type="number" id="liga-duration" min="4" max="52" value="8"
                           class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                </div>
            </div>
        `;

        setTimeout(() => {
            tournamentData.format.details = {
                teams: document.getElementById('liga-teams').value,
                matchesPerWeek: document.getElementById('liga-matches-per-week').value,
                duration: document.getElementById('liga-duration').value
            };
        }, 100);
    }

    container.innerHTML = html;
}

// ========================================
// STEP 3: PRIZES
// ========================================

function setPrizeType(type) {
    // Remove selection from all buttons
    document.querySelectorAll('.prize-type-btn').forEach(btn => {
        btn.classList.remove('border-primary', 'bg-primary/5');
        btn.classList.add('border-gray-600');
    });

    // Add selection to clicked button
    const selectedBtn = document.querySelector(`[data-prize="${type}"]`);
    selectedBtn.classList.add('border-primary', 'bg-primary/5');
    selectedBtn.classList.remove('border-gray-600');

    // Save prize type
    tournamentData.prizes.type = type;

    // Show/hide relevant fields
    if (type === 'dinero') {
        document.getElementById('dinero-fields').classList.remove('hidden');
        document.getElementById('productos-fields').classList.add('hidden');
    } else {
        document.getElementById('dinero-fields').classList.add('hidden');
        document.getElementById('productos-fields').classList.remove('hidden');
    }
}

function updateDistribution() {
    const distribution = document.getElementById('prize-distribution').value;
    const customDiv = document.getElementById('custom-distribution');

    if (distribution === 'custom') {
        customDiv.classList.remove('hidden');
    } else {
        customDiv.classList.add('hidden');
    }
}

// Update currency symbol when currency changes in step 1
document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('tournament-currency');
    if (currencySelect) {
        currencySelect.addEventListener('change', function() {
            const symbols = { EUR: '€', USD: '$', GBP: '£', ARS: '$' };
            const symbol = symbols[this.value] || this.value;
            const currencySymbol = document.getElementById('currency-symbol');
            if (currencySymbol) {
                currencySymbol.textContent = symbol;
            }
        });
    }
});

// ========================================
// STEP 4: SUMMARY
// ========================================

function populateSummary() {
    const summary = document.getElementById('tournament-summary');
    const data = tournamentData;

    const formatNames = {
        'americano': 'Formato Americano',
        'round-robin': 'Round Robin',
        'eliminacion': 'Eliminación Directa',
        'liga': 'Liga Mensual'
    };

    let html = `
        <div class="grid md:grid-cols-2 gap-4">
            <div>
                <span class="text-gray-400">Nombre:</span>
                <span class="font-semibold ml-2">${data.basicInfo.name}</span>
            </div>
            <div>
                <span class="text-gray-400">Ubicación:</span>
                <span class="font-semibold ml-2">${data.basicInfo.location}, ${data.basicInfo.city}</span>
            </div>
            <div>
                <span class="text-gray-400">Fechas:</span>
                <span class="font-semibold ml-2">${formatDate(data.basicInfo.startDate)} - ${formatDate(data.basicInfo.endDate)}</span>
            </div>
            <div>
                <span class="text-gray-400">Canchas:</span>
                <span class="font-semibold ml-2">${data.basicInfo.courts}</span>
            </div>
            <div>
                <span class="text-gray-400">Formato:</span>
                <span class="font-semibold ml-2">${formatNames[data.format.type] || data.format.type}</span>
            </div>
            <div>
                <span class="text-gray-400">Categorías:</span>
                <span class="font-semibold ml-2">${data.basicInfo.categories.join(', ') || 'No especificadas'}</span>
            </div>
    `;

    if (data.prizes.type === 'dinero') {
        html += `
            <div>
                <span class="text-gray-400">Prize Pool:</span>
                <span class="font-semibold ml-2">${data.prizes.amount} ${data.prizes.currency}</span>
            </div>
            <div>
                <span class="text-gray-400">Distribución:</span>
                <span class="font-semibold ml-2">${typeof data.prizes.distribution === 'string' ? data.prizes.distribution : 'Personalizado'}</span>
            </div>
        `;
    } else {
        html += `
            <div class="md:col-span-2">
                <span class="text-gray-400">Premios:</span>
                <span class="font-semibold ml-2">Productos (no monetarios)</span>
            </div>
        `;
    }

    if (data.prizes.organizerWallet) {
        html += `
            <div class="md:col-span-2">
                <span class="text-gray-400">Wallet organizador:</span>
                <span class="font-semibold ml-2 font-mono text-xs">${data.prizes.organizerWallet}</span>
            </div>
        `;
    }

    html += `</div>`;

    summary.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ========================================
// FINISH WIZARD & LOCALSTORAGE
// ========================================

function finishWizard() {
    // Save all data including invitations
    saveStepData(4);

    // Save tournament to localStorage
    saveTournamentToLocalStorage(tournamentData);

    // Redirect to auth page
    window.location.href = 'auth.html';
}

/**
 * Save tournament data to localStorage
 * @param {Object} tournamentObject - Complete tournament configuration
 */
function saveTournamentToLocalStorage(tournamentObject) {
    try {
        const tournaments = getStoredTournaments();

        // Add timestamp and ID
        tournamentObject.id = Date.now().toString();
        tournamentObject.createdAt = new Date().toISOString();
        tournamentObject.status = 'pending'; // pending, active, completed

        tournaments.push(tournamentObject);

        localStorage.setItem('padelflow_tournaments', JSON.stringify(tournaments));
        localStorage.setItem('padelflow_last_tournament', JSON.stringify(tournamentObject));

        console.log('✅ Tournament saved to localStorage:', tournamentObject);
    } catch (error) {
        console.error('❌ Error saving tournament:', error);
        alert('Hubo un error al guardar el torneo. Por favor, inténtalo de nuevo.');
    }
}

/**
 * Get all stored tournaments
 * @returns {Array} Array of tournament objects
 */
function getStoredTournaments() {
    try {
        const data = localStorage.getItem('padelflow_tournaments');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading tournaments:', error);
        return [];
    }
}

/**
 * Get the last created tournament
 * @returns {Object|null} Last tournament object or null
 */
function getLastTournamentFromLocalStorage() {
    try {
        const data = localStorage.getItem('padelflow_last_tournament');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading last tournament:', error);
        return null;
    }
}

/**
 * Mark user as authenticated
 */
function markUserAsAuthenticated() {
    localStorage.setItem('padelflow_user_authenticated', 'true');
    localStorage.setItem('padelflow_user_email', 'demo@padelflow.com'); // Demo email
    console.log('✅ User marked as authenticated');
}

/**
 * Check if user is authenticated
 * @returns {Boolean}
 */
function isUserAuthenticated() {
    return localStorage.getItem('padelflow_user_authenticated') === 'true';
}

/**
 * Activate a tournament (mark as paid/active)
 * @param {String} tournamentId - Tournament ID to activate
 */
function activateTournament(tournamentId) {
    try {
        const tournaments = getStoredTournaments();
        const tournament = tournaments.find(t => t.id === tournamentId);

        if (tournament) {
            tournament.status = 'active';
            tournament.activatedAt = new Date().toISOString();

            localStorage.setItem('padelflow_tournaments', JSON.stringify(tournaments));
            localStorage.setItem('padelflow_last_tournament', JSON.stringify(tournament));

            console.log('✅ Tournament activated:', tournament);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error activating tournament:', error);
        return false;
    }
}

// ========================================
// INITIALIZE
// ========================================

console.log('🎾 PadelFlow initialized');
console.log('📍 Current page:', window.location.pathname);

// Check if user came back to wizard with existing data
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    const lastTournament = getLastTournamentFromLocalStorage();
    if (lastTournament && lastTournament.status === 'pending') {
        console.log('Found pending tournament, could offer to resume...');
        // Future: Show modal to resume or start fresh
    }
}
