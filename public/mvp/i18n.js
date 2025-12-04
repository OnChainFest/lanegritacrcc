/**
 * PadelFlow i18n Translation System
 * Supports: English (en), Spanish (es), Portuguese (pt)
 */

const translations = {
    en: {
        // Navbar
        'nav.brand': 'PadelFlow',
        'nav.createTournament': 'Create Tournament',
        'nav.backToHome': 'Back to home',
        'nav.myTournaments': 'My Tournaments',
        'nav.templates': 'Templates',
        'nav.history': 'History',

        // Hero Section
        'hero.badge': '⚡ Automate your tournament',
        'hero.title': 'Create your padel tournament in <span class="text-primary">minutes</span>',
        'hero.subtitle': 'Configure format, prizes and participants. Share via email or QR. <span class="text-primary font-semibold">Pay only when you\'re ready to launch.</span>',
        'hero.createFirstTournament': 'Create my first tournament',
        'hero.seeHowItWorks': 'See how it works',
        'hero.stat.automated': 'Automated',
        'hero.stat.setupTime': 'To set up',
        'hero.stat.formats': 'Formats',
        'hero.formats': 'Americano • Round Robin • Elimination • League',

        // How it works
        'howItWorks.title': 'How does it work?',
        'howItWorks.subtitle': 'Set up your tournament in 3 simple steps',
        'howItWorks.step1.title': 'Configure the tournament',
        'howItWorks.step1.description': 'Choose the format (Americano, Round Robin, Elimination or League), define dates, categories and number of participants.',
        'howItWorks.step2.title': 'Define prizes',
        'howItWorks.step2.description': 'Configure the prize pool, prize distribution and connect your wallet to receive payments (coming soon: smart contracts).',
        'howItWorks.step3.title': 'Share and invite',
        'howItWorks.step3.description': 'Pay, activate your tournament and share the link or QR. Players register and everything is managed automatically.',

        // Benefits
        'benefits.title': 'Why PadelFlow?',
        'benefits.subtitle': 'The most modern way to organize tournaments',
        'benefits.saveTime.title': 'Save time',
        'benefits.saveTime.description': 'Automate draws, calendars and results',
        'benefits.formats.title': '4 Formats',
        'benefits.formats.description': 'Americano, Round Robin, Elimination and League',
        'benefits.smartContracts.title': 'Smart Contracts',
        'benefits.smartContracts.description': 'Automatic and transparent payments (coming soon)',
        'benefits.digital.title': '100% Digital',
        'benefits.digital.description': 'Invitations via email, link or QR code',

        // CTA
        'cta.title': 'Ready to organize your best tournament?',
        'cta.subtitle': 'Join the organizers already using PadelFlow',
        'cta.button': 'Start free, pay only to publish',

        // Footer
        'footer.description': 'The most modern platform for organizing padel tournaments',
        'footer.product': 'Product',
        'footer.features': 'Features',
        'footer.pricing': 'Pricing',
        'footer.roadmap': 'Roadmap',
        'footer.company': 'Company',
        'footer.about': 'About us',
        'footer.blog': 'Blog',
        'footer.contact': 'Contact',
        'footer.legal': 'Legal',
        'footer.privacy': 'Privacy',
        'footer.terms': 'Terms',
        'footer.cookies': 'Cookies',
        'footer.copyright': '© 2025 PadelFlow. All rights reserved.',

        // Wizard - Step 1
        'wizard.title': 'Create your tournament',
        'wizard.subtitle': 'Follow the steps and launch your tournament in minutes',
        'wizard.stepIndicator': 'Step {current} of {total}',
        'wizard.step1.name': 'Basic data',
        'wizard.step1.title': 'Basic tournament data',
        'wizard.step1.tournamentName': 'Tournament name *',
        'wizard.step1.tournamentNamePlaceholder': 'Ex: Summer Tournament 2025',
        'wizard.step1.location': 'Club / Location *',
        'wizard.step1.locationPlaceholder': 'Club name',
        'wizard.step1.city': 'City / Country *',
        'wizard.step1.cityPlaceholder': 'Ex: Madrid, Spain',
        'wizard.step1.startDate': 'Start date *',
        'wizard.step1.endDate': 'End date *',
        'wizard.step1.courts': 'Number of courts *',
        'wizard.step1.currency': 'Currency *',
        'wizard.step1.categories': 'Categories',
        'wizard.step1.category.beginner': 'Beginner',
        'wizard.step1.category.intermediate': 'Intermediate',
        'wizard.step1.category.advanced': 'Advanced',
        'wizard.step1.category.mixed': 'Mixed',
        'wizard.next': 'Next',
        'wizard.back': 'Back',

        // Wizard - Step 2
        'wizard.step2.name': 'Format',
        'wizard.step2.title': 'Select tournament format',
        'wizard.format.americano.title': 'Americano Format',
        'wizard.format.americano.description': 'Each pair plays with and against everyone. Points system for win/draw/loss.',
        'wizard.format.roundRobin.title': 'Round Robin',
        'wizard.format.roundRobin.description': 'Group stage. Best from each group advance to knockout finals.',
        'wizard.format.elimination.title': 'Direct Elimination',
        'wizard.format.elimination.description': 'Classic bracket. Lose and you\'re out. Option to include consolation bracket for losers.',
        'wizard.format.league.title': 'Monthly League',
        'wizard.format.league.description': 'Everyone against everyone over several weeks. Perfect for club leagues with extended calendar.',

        // Wizard - Step 3
        'wizard.step3.name': 'Prizes',
        'wizard.step3.title': 'Prizes and organizer wallet',
        'wizard.step3.prizeType': 'Prize type',
        'wizard.step3.money': 'Money',
        'wizard.step3.moneyDescription': 'Monetary prize pool',
        'wizard.step3.products': 'Products',
        'wizard.step3.productsDescription': 'Non-monetary prizes',
        'wizard.step3.prizePool': 'Total prize pool amount *',
        'wizard.step3.distribution': 'Prize distribution',
        'wizard.step3.distribution.50-30-20': '1st place: 50% • 2nd place: 30% • 3rd place: 20%',
        'wizard.step3.distribution.60-30-10': '1st place: 60% • 2nd place: 30% • 3rd place: 10%',
        'wizard.step3.distribution.70-20-10': '1st place: 70% • 2nd place: 20% • 3rd place: 10%',
        'wizard.step3.distribution.custom': 'Custom',
        'wizard.step3.customDistribution': 'Custom distribution (%)',
        'wizard.step3.firstPlace': '1st place',
        'wizard.step3.secondPlace': '2nd place',
        'wizard.step3.thirdPlace': '3rd place',
        'wizard.step3.prizeDescription': 'Prize description *',
        'wizard.step3.prizeDescriptionPlaceholder': 'Ex: 1st place: Professional Wilson racket\n2nd place: Sports bag\n3rd place: Ball pack',
        'wizard.step3.organizerWallet': 'Organizer wallet',
        'wizard.step3.walletDescription': 'In the future, you\'ll connect your wallet here to receive automatic payments via smart contract. For now, enter a wallet address or leave blank.',
        'wizard.step3.walletPlaceholder': '0x... (optional for now)',
        'wizard.step3.walletFuture': '🔜 Coming soon: Integration with Coinbase Smart Wallets, Base, XRPL',

        // Wizard - Step 4
        'wizard.step4.name': 'Preview',
        'wizard.step4.title': 'Preview and invitation settings',
        'wizard.step4.summary': 'Tournament summary',
        'wizard.step4.invitationOptions': 'Invitation options',
        'wizard.step4.shareableLink': 'Shareable link',
        'wizard.step4.shareableLinkDescription': 'Generate a unique link for players to register',
        'wizard.step4.emailInvite': 'Email invitation',
        'wizard.step4.emailInviteDescription': 'Send automatic email invitations',
        'wizard.step4.qrCode': 'QR Code',
        'wizard.step4.qrCodeDescription': 'Generate a QR code to share physically or on social media',
        'wizard.step4.readyTitle': 'Your tournament is almost ready',
        'wizard.step4.readyDescription': 'To activate invitations and access the management dashboard, you need to create an account and make the activation payment.',
        'wizard.finish': 'Create account and activate tournament',

        // Auth Page
        'auth.oneMoreStep': 'One more step to activate your tournament',
        'auth.tournamentConfigured': 'Tournament configured:',
        'auth.step.account': 'Account',
        'auth.step.payment': 'Payment',
        'auth.step.dashboard': 'Dashboard',
        'auth.createAccount': 'Create your account',
        'auth.enterData': 'Enter your details to activate your tournament',
        'auth.fullName': 'Full name *',
        'auth.fullNamePlaceholder': 'John Doe',
        'auth.email': 'Email *',
        'auth.emailPlaceholder': 'your@email.com',
        'auth.password': 'Password *',
        'auth.passwordPlaceholder': 'Minimum 6 characters',
        'auth.passwordHint': 'At least 6 characters',
        'auth.termsAccept': 'I accept the <a href="#" class="text-primary hover:underline">terms and conditions</a> and the <a href="#" class="text-primary hover:underline">privacy policy</a>',
        'auth.createAndContinue': 'Create account and continue',
        'auth.alreadyHaveAccount': 'Already have an account?',
        'auth.login': 'Log in',
        'auth.processingPayment': 'Processing payment',
        'auth.processingDescription': 'We are simulating the payment process...',
        'auth.paymentComplete': 'Payment complete!',
        'auth.tournamentActivated': 'Your tournament has been activated successfully',
        'auth.whatNext': 'What\'s next?',
        'auth.accessDashboard': 'Access the dashboard',
        'auth.accessDashboardDescription': 'Manage your tournament from the control panel',
        'auth.generateInvitations': 'Generate invitations',
        'auth.generateInvitationsDescription': 'Links, QR codes and emails for players',
        'auth.manageRegistrations': 'Manage registrations',
        'auth.manageRegistrationsDescription': 'Review and confirm participants',
        'auth.goToDashboard': 'Go to Dashboard',

        // Dashboard
        'dashboard.welcome': 'Welcome, <span id="user-name">User</span> 👋',
        'dashboard.subtitle': 'Manage your tournaments and review registration status',
        'dashboard.stats.active': 'Active tournaments',
        'dashboard.stats.participants': 'Total participants',
        'dashboard.stats.pending': 'Pending invitations',
        'dashboard.stats.total': 'Total tournaments',
        'dashboard.activeTournaments': 'Active Tournaments',
        'dashboard.newTournament': 'New tournament',
        'dashboard.noActiveTournaments': 'You have no active tournaments',
        'dashboard.createFirstTournament': 'Create your first tournament',
        'dashboard.createMyFirstTournament': 'Create my first tournament',
        'dashboard.comingSoon': 'Coming soon',
        'dashboard.participantResponses': 'Participant responses',
        'dashboard.participantResponsesDescription': 'Manage player confirmations and registrations',
        'dashboard.paymentStatus': 'Payment status',
        'dashboard.paymentStatusDescription': 'Review registration payments and prize pool',
        'dashboard.smartContracts': 'Smart Contracts',
        'dashboard.smartContractsDescription': 'Automatic on-chain prize distribution',
        'dashboard.viewDetail': 'View detail',
        'dashboard.invitations': 'Invitations',
        'dashboard.createTournament': 'Create tournament',
        'dashboard.fromScratch': 'From scratch',
        'dashboard.fromScratchDescription': 'Set up a new tournament step by step',
        'dashboard.useTemplate': 'Use template',
        'dashboard.useTemplateDescription': 'Start from previous tournaments (coming soon)',
        'dashboard.cancel': 'Cancel',

        // Tournament Detail Modal
        'modal.tournamentDetail': 'Tournament detail',
        'modal.basicInfo': 'Basic information',
        'modal.location': 'Location:',
        'modal.city': 'City:',
        'modal.startDate': 'Start date:',
        'modal.endDate': 'End date:',
        'modal.courts': 'Courts:',
        'modal.format': 'Format:',
        'modal.prizes': 'Prizes',
        'modal.prizePool': 'Prize Pool:',
        'modal.distribution': 'Distribution:',
        'modal.nonMonetaryPrizes': 'Non-monetary prizes:',
        'modal.status': 'Status',
        'modal.tournamentActive': 'Tournament active',
        'modal.tournamentPending': 'Pending activation',
        'modal.invitationsNotSent': '• Invitations: Not sent yet',
        'modal.confirmedParticipants': '• Confirmed participants: 0',
        'modal.paymentsReceived': '• Payments received: 0',

        // Invitations Modal
        'invitations.title': 'Generate invitations',
        'invitations.link': 'Invitation link',
        'invitations.linkDescription': 'Share this link with players to register',
        'invitations.copy': 'Copy',
        'invitations.qrCode': 'QR Code',
        'invitations.tournamentQR': 'Tournament QR code',
        'invitations.qrProduction': 'In production, a real QR will be generated here',
        'invitations.emailInvite': 'Email invitation',
        'invitations.emailDescription': 'Send automatic email invitations',
        'invitations.emailPlaceholder': 'Enter emails separated by commas...',
        'invitations.sendInvitations': 'Send invitations (coming soon)',
        'invitations.emailIntegration': '🔜 Email service integration in development',
        'invitations.linkCopied': 'Link copied to clipboard!',

        // Common
        'common.active': 'Active',
        'common.pending': 'Pending',
        'common.close': 'Close',
    },

    es: {
        // Navbar
        'nav.brand': 'PadelFlow',
        'nav.createTournament': 'Crear Torneo',
        'nav.backToHome': 'Volver al inicio',
        'nav.myTournaments': 'Mis torneos',
        'nav.templates': 'Plantillas',
        'nav.history': 'Historial',

        // Hero Section
        'hero.badge': '⚡ Automatiza tu torneo',
        'hero.title': 'Crea tu torneo de pádel en <span class="text-primary">minutos</span>',
        'hero.subtitle': 'Configura el formato, premios y participantes. Comparte por correo o QR. <span class="text-primary font-semibold">Paga solo cuando estés listo para lanzar.</span>',
        'hero.createFirstTournament': 'Crear mi primer torneo',
        'hero.seeHowItWorks': 'Ver cómo funciona',
        'hero.stat.automated': 'Automatizado',
        'hero.stat.setupTime': 'Para configurar',
        'hero.stat.formats': 'Formatos',
        'hero.formats': 'Americano • Round Robin • Eliminación • Liga',

        // How it works
        'howItWorks.title': '¿Cómo funciona?',
        'howItWorks.subtitle': 'Configura tu torneo en 3 simples pasos',
        'howItWorks.step1.title': 'Configura el torneo',
        'howItWorks.step1.description': 'Elige el formato (Americano, Round Robin, Eliminación o Liga), define fechas, categorías y número de participantes.',
        'howItWorks.step2.title': 'Define premios',
        'howItWorks.step2.description': 'Configura el prize pool, distribución de premios y conecta tu wallet para recibir pagos (próximamente: smart contracts).',
        'howItWorks.step3.title': 'Comparte e invita',
        'howItWorks.step3.description': 'Paga, activa tu torneo y comparte el link o QR. Los jugadores se registran y todo se gestiona automáticamente.',

        // Benefits
        'benefits.title': '¿Por qué PadelFlow?',
        'benefits.subtitle': 'La forma más moderna de organizar torneos',
        'benefits.saveTime.title': 'Ahorra tiempo',
        'benefits.saveTime.description': 'Automatiza sorteos, calendarios y resultados',
        'benefits.formats.title': '4 Formatos',
        'benefits.formats.description': 'Americano, Round Robin, Eliminación y Liga',
        'benefits.smartContracts.title': 'Smart Contracts',
        'benefits.smartContracts.description': 'Pagos automáticos y transparentes (próximamente)',
        'benefits.digital.title': '100% Digital',
        'benefits.digital.description': 'Invitaciones por email, link o QR code',

        // CTA
        'cta.title': '¿Listo para organizar tu mejor torneo?',
        'cta.subtitle': 'Únete a los organizadores que ya están usando PadelFlow',
        'cta.button': 'Empieza gratis, paga sólo al publicar',

        // Footer
        'footer.description': 'La plataforma más moderna para organizar torneos de pádel',
        'footer.product': 'Producto',
        'footer.features': 'Características',
        'footer.pricing': 'Precios',
        'footer.roadmap': 'Roadmap',
        'footer.company': 'Empresa',
        'footer.about': 'Sobre nosotros',
        'footer.blog': 'Blog',
        'footer.contact': 'Contacto',
        'footer.legal': 'Legal',
        'footer.privacy': 'Privacidad',
        'footer.terms': 'Términos',
        'footer.cookies': 'Cookies',
        'footer.copyright': '© 2025 PadelFlow. Todos los derechos reservados.',

        // Wizard - Step 1
        'wizard.title': 'Crea tu torneo',
        'wizard.subtitle': 'Sigue los pasos y lanza tu torneo en minutos',
        'wizard.stepIndicator': 'Paso {current} de {total}',
        'wizard.step1.name': 'Datos básicos',
        'wizard.step1.title': 'Datos básicos del torneo',
        'wizard.step1.tournamentName': 'Nombre del torneo *',
        'wizard.step1.tournamentNamePlaceholder': 'Ej: Torneo Verano 2025',
        'wizard.step1.location': 'Club / Ubicación *',
        'wizard.step1.locationPlaceholder': 'Nombre del club',
        'wizard.step1.city': 'Ciudad / País *',
        'wizard.step1.cityPlaceholder': 'Ej: Madrid, España',
        'wizard.step1.startDate': 'Fecha de inicio *',
        'wizard.step1.endDate': 'Fecha de fin *',
        'wizard.step1.courts': 'Número de canchas *',
        'wizard.step1.currency': 'Moneda *',
        'wizard.step1.categories': 'Categorías',
        'wizard.step1.category.beginner': 'Principiante',
        'wizard.step1.category.intermediate': 'Intermedio',
        'wizard.step1.category.advanced': 'Avanzado',
        'wizard.step1.category.mixed': 'Mixto',
        'wizard.next': 'Siguiente',
        'wizard.back': 'Atrás',

        // Wizard - Step 2
        'wizard.step2.name': 'Formato',
        'wizard.step2.title': 'Selecciona el formato del torneo',
        'wizard.format.americano.title': 'Formato Americano',
        'wizard.format.americano.description': 'Cada pareja juega con y contra todos. Sistema de puntos por victoria/empate/derrota.',
        'wizard.format.roundRobin.title': 'Round Robin',
        'wizard.format.roundRobin.description': 'Liguilla por grupos. Los mejores de cada grupo pasan a cuadro final de eliminación directa.',
        'wizard.format.elimination.title': 'Eliminación Directa',
        'wizard.format.elimination.description': 'Cuadro clásico. Pierdes y quedas fuera. Opción de incluir cuadro de consolación para los perdedores.',
        'wizard.format.league.title': 'Liga Mensual',
        'wizard.format.league.description': 'Todos contra todos durante varias semanas. Perfecto para ligas de club con calendario extendido.',

        // Wizard - Step 3
        'wizard.step3.name': 'Premios',
        'wizard.step3.title': 'Premios y wallet del organizador',
        'wizard.step3.prizeType': 'Tipo de premio',
        'wizard.step3.money': 'Dinero',
        'wizard.step3.moneyDescription': 'Prize pool monetario',
        'wizard.step3.products': 'Productos',
        'wizard.step3.productsDescription': 'Premios no monetarios',
        'wizard.step3.prizePool': 'Monto total del prize pool *',
        'wizard.step3.distribution': 'Distribución de premios',
        'wizard.step3.distribution.50-30-20': '1° lugar: 50% • 2° lugar: 30% • 3° lugar: 20%',
        'wizard.step3.distribution.60-30-10': '1° lugar: 60% • 2° lugar: 30% • 3° lugar: 10%',
        'wizard.step3.distribution.70-20-10': '1° lugar: 70% • 2° lugar: 20% • 3° lugar: 10%',
        'wizard.step3.distribution.custom': 'Personalizado',
        'wizard.step3.customDistribution': 'Distribución personalizada (%)',
        'wizard.step3.firstPlace': '1° lugar',
        'wizard.step3.secondPlace': '2° lugar',
        'wizard.step3.thirdPlace': '3° lugar',
        'wizard.step3.prizeDescription': 'Descripción de premios *',
        'wizard.step3.prizeDescriptionPlaceholder': 'Ej: 1° lugar: Paleta profesional Wilson\n2° lugar: Bolso deportivo\n3° lugar: Pack de pelotas',
        'wizard.step3.organizerWallet': 'Wallet del organizador',
        'wizard.step3.walletDescription': 'En el futuro, conectarás tu wallet aquí para recibir pagos automáticos vía smart contract. Por ahora, ingresa una dirección de wallet o deja en blanco.',
        'wizard.step3.walletPlaceholder': '0x... (opcional por ahora)',
        'wizard.step3.walletFuture': '🔜 Próximamente: Integración con Coinbase Smart Wallets, Base, XRPL',

        // Wizard - Step 4
        'wizard.step4.name': 'Vista previa',
        'wizard.step4.title': 'Vista previa y configuración de invitaciones',
        'wizard.step4.summary': 'Resumen del torneo',
        'wizard.step4.invitationOptions': 'Opciones de invitación',
        'wizard.step4.shareableLink': 'Link compartible',
        'wizard.step4.shareableLinkDescription': 'Genera un link único para que los jugadores se registren',
        'wizard.step4.emailInvite': 'Invitación por correo',
        'wizard.step4.emailInviteDescription': 'Envía invitaciones automáticas por email',
        'wizard.step4.qrCode': 'Código QR',
        'wizard.step4.qrCodeDescription': 'Genera un QR code para compartir en físico o redes sociales',
        'wizard.step4.readyTitle': 'Tu torneo está casi listo',
        'wizard.step4.readyDescription': 'Para activar las invitaciones y acceder al dashboard de gestión, necesitas crear una cuenta y realizar el pago de activación.',
        'wizard.finish': 'Crear cuenta y activar torneo',

        // Auth Page
        'auth.oneMoreStep': 'Un paso más para activar tu torneo',
        'auth.tournamentConfigured': 'Torneo configurado:',
        'auth.step.account': 'Cuenta',
        'auth.step.payment': 'Pago',
        'auth.step.dashboard': 'Dashboard',
        'auth.createAccount': 'Crea tu cuenta',
        'auth.enterData': 'Ingresa tus datos para activar tu torneo',
        'auth.fullName': 'Nombre completo *',
        'auth.fullNamePlaceholder': 'Juan Pérez',
        'auth.email': 'Email *',
        'auth.emailPlaceholder': 'tu@email.com',
        'auth.password': 'Contraseña *',
        'auth.passwordPlaceholder': 'Mínimo 6 caracteres',
        'auth.passwordHint': 'Al menos 6 caracteres',
        'auth.termsAccept': 'Acepto los <a href="#" class="text-primary hover:underline">términos y condiciones</a> y la <a href="#" class="text-primary hover:underline">política de privacidad</a>',
        'auth.createAndContinue': 'Crear cuenta y continuar',
        'auth.alreadyHaveAccount': '¿Ya tienes cuenta?',
        'auth.login': 'Inicia sesión',
        'auth.processingPayment': 'Procesando pago',
        'auth.processingDescription': 'Estamos simulando el proceso de pago...',
        'auth.paymentComplete': '¡Pago completado!',
        'auth.tournamentActivated': 'Tu torneo ha sido activado correctamente',
        'auth.whatNext': '¿Qué sigue?',
        'auth.accessDashboard': 'Accede al dashboard',
        'auth.accessDashboardDescription': 'Gestiona tu torneo desde el panel de control',
        'auth.generateInvitations': 'Genera invitaciones',
        'auth.generateInvitationsDescription': 'Links, QR codes y emails para jugadores',
        'auth.manageRegistrations': 'Gestiona inscripciones',
        'auth.manageRegistrationsDescription': 'Revisa y confirma participantes',
        'auth.goToDashboard': 'Ir al Dashboard',

        // Dashboard
        'dashboard.welcome': 'Bienvenido, <span id="user-name">Usuario</span> 👋',
        'dashboard.subtitle': 'Gestiona tus torneos y revisa el estado de las inscripciones',
        'dashboard.stats.active': 'Torneos activos',
        'dashboard.stats.participants': 'Participantes totales',
        'dashboard.stats.pending': 'Invitaciones pendientes',
        'dashboard.stats.total': 'Torneos totales',
        'dashboard.activeTournaments': 'Torneos Activos',
        'dashboard.newTournament': 'Nuevo torneo',
        'dashboard.noActiveTournaments': 'No tienes torneos activos',
        'dashboard.createFirstTournament': 'Crea tu primer torneo para empezar',
        'dashboard.createMyFirstTournament': 'Crear mi primer torneo',
        'dashboard.comingSoon': 'Próximamente',
        'dashboard.participantResponses': 'Respuestas de participantes',
        'dashboard.participantResponsesDescription': 'Gestiona confirmaciones y registros de jugadores',
        'dashboard.paymentStatus': 'Estado de pagos',
        'dashboard.paymentStatusDescription': 'Revisa pagos de inscripción y prize pool',
        'dashboard.smartContracts': 'Smart Contracts',
        'dashboard.smartContractsDescription': 'Distribución automática de premios on-chain',
        'dashboard.viewDetail': 'Ver detalle',
        'dashboard.invitations': 'Invitaciones',
        'dashboard.createTournament': 'Crear torneo',
        'dashboard.fromScratch': 'Desde cero',
        'dashboard.fromScratchDescription': 'Configurar un nuevo torneo paso a paso',
        'dashboard.useTemplate': 'Usar plantilla',
        'dashboard.useTemplateDescription': 'Partir de torneos anteriores (próximamente)',
        'dashboard.cancel': 'Cancelar',

        // Tournament Detail Modal
        'modal.tournamentDetail': 'Detalle del torneo',
        'modal.basicInfo': 'Información básica',
        'modal.location': 'Ubicación:',
        'modal.city': 'Ciudad:',
        'modal.startDate': 'Fecha inicio:',
        'modal.endDate': 'Fecha fin:',
        'modal.courts': 'Canchas:',
        'modal.format': 'Formato:',
        'modal.prizes': 'Premios',
        'modal.prizePool': 'Prize Pool:',
        'modal.distribution': 'Distribución:',
        'modal.nonMonetaryPrizes': 'Premios no monetarios:',
        'modal.status': 'Estado',
        'modal.tournamentActive': 'Torneo activo',
        'modal.tournamentPending': 'Pendiente de activación',
        'modal.invitationsNotSent': '• Invitaciones: No enviadas aún',
        'modal.confirmedParticipants': '• Participantes confirmados: 0',
        'modal.paymentsReceived': '• Pagos recibidos: 0',

        // Invitations Modal
        'invitations.title': 'Generar invitaciones',
        'invitations.link': 'Link de invitación',
        'invitations.linkDescription': 'Comparte este link con los jugadores para que se registren',
        'invitations.copy': 'Copiar',
        'invitations.qrCode': 'Código QR',
        'invitations.tournamentQR': 'Código QR del torneo',
        'invitations.qrProduction': 'En producción, aquí se generará un QR real',
        'invitations.emailInvite': 'Invitación por correo',
        'invitations.emailDescription': 'Envía invitaciones automáticas por email',
        'invitations.emailPlaceholder': 'Ingresa emails separados por comas...',
        'invitations.sendInvitations': 'Enviar invitaciones (próximamente)',
        'invitations.emailIntegration': '🔜 Integración con servicio de email en desarrollo',
        'invitations.linkCopied': 'Link copiado al portapapeles!',

        // Common
        'common.active': 'Activo',
        'common.pending': 'Pendiente',
        'common.close': 'Cerrar',
    },

    pt: {
        // Navbar
        'nav.brand': 'PadelFlow',
        'nav.createTournament': 'Criar Torneio',
        'nav.backToHome': 'Voltar ao início',
        'nav.myTournaments': 'Meus torneios',
        'nav.templates': 'Modelos',
        'nav.history': 'Histórico',

        // Hero Section
        'hero.badge': '⚡ Automatize seu torneio',
        'hero.title': 'Crie seu torneio de padel em <span class="text-primary">minutos</span>',
        'hero.subtitle': 'Configure o formato, prêmios e participantes. Compartilhe por e-mail ou QR. <span class="text-primary font-semibold">Pague apenas quando estiver pronto para lançar.</span>',
        'hero.createFirstTournament': 'Criar meu primeiro torneio',
        'hero.seeHowItWorks': 'Ver como funciona',
        'hero.stat.automated': 'Automatizado',
        'hero.stat.setupTime': 'Para configurar',
        'hero.stat.formats': 'Formatos',
        'hero.formats': 'Americano • Round Robin • Eliminação • Liga',

        // How it works
        'howItWorks.title': 'Como funciona?',
        'howItWorks.subtitle': 'Configure seu torneio em 3 passos simples',
        'howItWorks.step1.title': 'Configure o torneio',
        'howItWorks.step1.description': 'Escolha o formato (Americano, Round Robin, Eliminação ou Liga), defina datas, categorias e número de participantes.',
        'howItWorks.step2.title': 'Defina prêmios',
        'howItWorks.step2.description': 'Configure o prize pool, distribuição de prêmios e conecte sua carteira para receber pagamentos (em breve: smart contracts).',
        'howItWorks.step3.title': 'Compartilhe e convide',
        'howItWorks.step3.description': 'Pague, ative seu torneio e compartilhe o link ou QR. Os jogadores se registram e tudo é gerenciado automaticamente.',

        // Benefits
        'benefits.title': 'Por que PadelFlow?',
        'benefits.subtitle': 'A forma mais moderna de organizar torneios',
        'benefits.saveTime.title': 'Economize tempo',
        'benefits.saveTime.description': 'Automatize sorteios, calendários e resultados',
        'benefits.formats.title': '4 Formatos',
        'benefits.formats.description': 'Americano, Round Robin, Eliminação e Liga',
        'benefits.smartContracts.title': 'Smart Contracts',
        'benefits.smartContracts.description': 'Pagamentos automáticos e transparentes (em breve)',
        'benefits.digital.title': '100% Digital',
        'benefits.digital.description': 'Convites por e-mail, link ou QR code',

        // CTA
        'cta.title': 'Pronto para organizar seu melhor torneio?',
        'cta.subtitle': 'Junte-se aos organizadores que já estão usando PadelFlow',
        'cta.button': 'Comece grátis, pague apenas para publicar',

        // Footer
        'footer.description': 'A plataforma mais moderna para organizar torneios de padel',
        'footer.product': 'Produto',
        'footer.features': 'Recursos',
        'footer.pricing': 'Preços',
        'footer.roadmap': 'Roadmap',
        'footer.company': 'Empresa',
        'footer.about': 'Sobre nós',
        'footer.blog': 'Blog',
        'footer.contact': 'Contato',
        'footer.legal': 'Legal',
        'footer.privacy': 'Privacidade',
        'footer.terms': 'Termos',
        'footer.cookies': 'Cookies',
        'footer.copyright': '© 2025 PadelFlow. Todos os direitos reservados.',

        // Wizard - Step 1
        'wizard.title': 'Crie seu torneio',
        'wizard.subtitle': 'Siga os passos e lance seu torneio em minutos',
        'wizard.stepIndicator': 'Passo {current} de {total}',
        'wizard.step1.name': 'Dados básicos',
        'wizard.step1.title': 'Dados básicos do torneio',
        'wizard.step1.tournamentName': 'Nome do torneio *',
        'wizard.step1.tournamentNamePlaceholder': 'Ex: Torneio Verão 2025',
        'wizard.step1.location': 'Clube / Localização *',
        'wizard.step1.locationPlaceholder': 'Nome do clube',
        'wizard.step1.city': 'Cidade / País *',
        'wizard.step1.cityPlaceholder': 'Ex: Madrid, Espanha',
        'wizard.step1.startDate': 'Data de início *',
        'wizard.step1.endDate': 'Data de término *',
        'wizard.step1.courts': 'Número de quadras *',
        'wizard.step1.currency': 'Moeda *',
        'wizard.step1.categories': 'Categorias',
        'wizard.step1.category.beginner': 'Iniciante',
        'wizard.step1.category.intermediate': 'Intermediário',
        'wizard.step1.category.advanced': 'Avançado',
        'wizard.step1.category.mixed': 'Misto',
        'wizard.next': 'Próximo',
        'wizard.back': 'Voltar',

        // Wizard - Step 2
        'wizard.step2.name': 'Formato',
        'wizard.step2.title': 'Selecione o formato do torneio',
        'wizard.format.americano.title': 'Formato Americano',
        'wizard.format.americano.description': 'Cada dupla joga com e contra todos. Sistema de pontos por vitória/empate/derrota.',
        'wizard.format.roundRobin.title': 'Round Robin',
        'wizard.format.roundRobin.description': 'Fase de grupos. Os melhores de cada grupo avançam para as finais eliminatórias.',
        'wizard.format.elimination.title': 'Eliminação Direta',
        'wizard.format.elimination.description': 'Chave clássica. Perde e está fora. Opção de incluir chave de consolação para os perdedores.',
        'wizard.format.league.title': 'Liga Mensal',
        'wizard.format.league.description': 'Todos contra todos durante várias semanas. Perfeito para ligas de clube com calendário estendido.',

        // Wizard - Step 3
        'wizard.step3.name': 'Prêmios',
        'wizard.step3.title': 'Prêmios e carteira do organizador',
        'wizard.step3.prizeType': 'Tipo de prêmio',
        'wizard.step3.money': 'Dinheiro',
        'wizard.step3.moneyDescription': 'Prize pool monetário',
        'wizard.step3.products': 'Produtos',
        'wizard.step3.productsDescription': 'Prêmios não monetários',
        'wizard.step3.prizePool': 'Valor total do prize pool *',
        'wizard.step3.distribution': 'Distribuição de prêmios',
        'wizard.step3.distribution.50-30-20': '1º lugar: 50% • 2º lugar: 30% • 3º lugar: 20%',
        'wizard.step3.distribution.60-30-10': '1º lugar: 60% • 2º lugar: 30% • 3º lugar: 10%',
        'wizard.step3.distribution.70-20-10': '1º lugar: 70% • 2º lugar: 20% • 3º lugar: 10%',
        'wizard.step3.distribution.custom': 'Personalizado',
        'wizard.step3.customDistribution': 'Distribuição personalizada (%)',
        'wizard.step3.firstPlace': '1º lugar',
        'wizard.step3.secondPlace': '2º lugar',
        'wizard.step3.thirdPlace': '3º lugar',
        'wizard.step3.prizeDescription': 'Descrição dos prêmios *',
        'wizard.step3.prizeDescriptionPlaceholder': 'Ex: 1º lugar: Raquete profissional Wilson\n2º lugar: Bolsa esportiva\n3º lugar: Pacote de bolas',
        'wizard.step3.organizerWallet': 'Carteira do organizador',
        'wizard.step3.walletDescription': 'No futuro, você conectará sua carteira aqui para receber pagamentos automáticos via smart contract. Por enquanto, insira um endereço de carteira ou deixe em branco.',
        'wizard.step3.walletPlaceholder': '0x... (opcional por enquanto)',
        'wizard.step3.walletFuture': '🔜 Em breve: Integração com Coinbase Smart Wallets, Base, XRPL',

        // Wizard - Step 4
        'wizard.step4.name': 'Visualização',
        'wizard.step4.title': 'Visualização e configuração de convites',
        'wizard.step4.summary': 'Resumo do torneio',
        'wizard.step4.invitationOptions': 'Opções de convite',
        'wizard.step4.shareableLink': 'Link compartilhável',
        'wizard.step4.shareableLinkDescription': 'Gere um link único para os jogadores se registrarem',
        'wizard.step4.emailInvite': 'Convite por e-mail',
        'wizard.step4.emailInviteDescription': 'Envie convites automáticos por e-mail',
        'wizard.step4.qrCode': 'Código QR',
        'wizard.step4.qrCodeDescription': 'Gere um QR code para compartilhar fisicamente ou nas redes sociais',
        'wizard.step4.readyTitle': 'Seu torneio está quase pronto',
        'wizard.step4.readyDescription': 'Para ativar os convites e acessar o painel de gerenciamento, você precisa criar uma conta e fazer o pagamento de ativação.',
        'wizard.finish': 'Criar conta e ativar torneio',

        // Auth Page
        'auth.oneMoreStep': 'Mais um passo para ativar seu torneio',
        'auth.tournamentConfigured': 'Torneio configurado:',
        'auth.step.account': 'Conta',
        'auth.step.payment': 'Pagamento',
        'auth.step.dashboard': 'Dashboard',
        'auth.createAccount': 'Crie sua conta',
        'auth.enterData': 'Insira seus dados para ativar seu torneio',
        'auth.fullName': 'Nome completo *',
        'auth.fullNamePlaceholder': 'João Silva',
        'auth.email': 'E-mail *',
        'auth.emailPlaceholder': 'seu@email.com',
        'auth.password': 'Senha *',
        'auth.passwordPlaceholder': 'Mínimo 6 caracteres',
        'auth.passwordHint': 'Pelo menos 6 caracteres',
        'auth.termsAccept': 'Aceito os <a href="#" class="text-primary hover:underline">termos e condições</a> e a <a href="#" class="text-primary hover:underline">política de privacidade</a>',
        'auth.createAndContinue': 'Criar conta e continuar',
        'auth.alreadyHaveAccount': 'Já tem uma conta?',
        'auth.login': 'Entrar',
        'auth.processingPayment': 'Processando pagamento',
        'auth.processingDescription': 'Estamos simulando o processo de pagamento...',
        'auth.paymentComplete': 'Pagamento concluído!',
        'auth.tournamentActivated': 'Seu torneio foi ativado com sucesso',
        'auth.whatNext': 'O que vem a seguir?',
        'auth.accessDashboard': 'Acesse o dashboard',
        'auth.accessDashboardDescription': 'Gerencie seu torneio do painel de controle',
        'auth.generateInvitations': 'Gere convites',
        'auth.generateInvitationsDescription': 'Links, QR codes e e-mails para jogadores',
        'auth.manageRegistrations': 'Gerencie inscrições',
        'auth.manageRegistrationsDescription': 'Revise e confirme participantes',
        'auth.goToDashboard': 'Ir para o Dashboard',

        // Dashboard
        'dashboard.welcome': 'Bem-vindo, <span id="user-name">Usuário</span> 👋',
        'dashboard.subtitle': 'Gerencie seus torneios e revise o status das inscrições',
        'dashboard.stats.active': 'Torneios ativos',
        'dashboard.stats.participants': 'Participantes totais',
        'dashboard.stats.pending': 'Convites pendentes',
        'dashboard.stats.total': 'Torneios totais',
        'dashboard.activeTournaments': 'Torneios Ativos',
        'dashboard.newTournament': 'Novo torneio',
        'dashboard.noActiveTournaments': 'Você não tem torneios ativos',
        'dashboard.createFirstTournament': 'Crie seu primeiro torneio para começar',
        'dashboard.createMyFirstTournament': 'Criar meu primeiro torneio',
        'dashboard.comingSoon': 'Em breve',
        'dashboard.participantResponses': 'Respostas dos participantes',
        'dashboard.participantResponsesDescription': 'Gerencie confirmações e registros de jogadores',
        'dashboard.paymentStatus': 'Status de pagamentos',
        'dashboard.paymentStatusDescription': 'Revise pagamentos de inscrição e prize pool',
        'dashboard.smartContracts': 'Smart Contracts',
        'dashboard.smartContractsDescription': 'Distribuição automática de prêmios on-chain',
        'dashboard.viewDetail': 'Ver detalhes',
        'dashboard.invitations': 'Convites',
        'dashboard.createTournament': 'Criar torneio',
        'dashboard.fromScratch': 'Do zero',
        'dashboard.fromScratchDescription': 'Configurar um novo torneio passo a passo',
        'dashboard.useTemplate': 'Usar modelo',
        'dashboard.useTemplateDescription': 'Começar de torneios anteriores (em breve)',
        'dashboard.cancel': 'Cancelar',

        // Tournament Detail Modal
        'modal.tournamentDetail': 'Detalhes do torneio',
        'modal.basicInfo': 'Informações básicas',
        'modal.location': 'Localização:',
        'modal.city': 'Cidade:',
        'modal.startDate': 'Data de início:',
        'modal.endDate': 'Data de término:',
        'modal.courts': 'Quadras:',
        'modal.format': 'Formato:',
        'modal.prizes': 'Prêmios',
        'modal.prizePool': 'Prize Pool:',
        'modal.distribution': 'Distribuição:',
        'modal.nonMonetaryPrizes': 'Prêmios não monetários:',
        'modal.status': 'Status',
        'modal.tournamentActive': 'Torneio ativo',
        'modal.tournamentPending': 'Pendente de ativação',
        'modal.invitationsNotSent': '• Convites: Ainda não enviados',
        'modal.confirmedParticipants': '• Participantes confirmados: 0',
        'modal.paymentsReceived': '• Pagamentos recebidos: 0',

        // Invitations Modal
        'invitations.title': 'Gerar convites',
        'invitations.link': 'Link de convite',
        'invitations.linkDescription': 'Compartilhe este link com os jogadores para se registrarem',
        'invitations.copy': 'Copiar',
        'invitations.qrCode': 'Código QR',
        'invitations.tournamentQR': 'Código QR do torneio',
        'invitations.qrProduction': 'Em produção, um QR real será gerado aqui',
        'invitations.emailInvite': 'Convite por e-mail',
        'invitations.emailDescription': 'Envie convites automáticos por e-mail',
        'invitations.emailPlaceholder': 'Insira e-mails separados por vírgulas...',
        'invitations.sendInvitations': 'Enviar convites (em breve)',
        'invitations.emailIntegration': '🔜 Integração com serviço de e-mail em desenvolvimento',
        'invitations.linkCopied': 'Link copiado para a área de transferência!',

        // Common
        'common.active': 'Ativo',
        'common.pending': 'Pendente',
        'common.close': 'Fechar',
    }
};

// Current language (default to English)
let currentLang = localStorage.getItem('padelflow_language') || 'en';

/**
 * Get browser's preferred language
 */
function getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0]; // Get 'es' from 'es-ES'

    // Check if we support this language
    if (translations[langCode]) {
        return langCode;
    }

    // Default to English
    return 'en';
}

/**
 * Get translation for a key
 * @param {string} key - Translation key (e.g., 'hero.title')
 * @param {object} params - Parameters to replace in translation (e.g., {current: 1, total: 4})
 * @returns {string} Translated text
 */
function t(key, params = {}) {
    let translation = translations[currentLang]?.[key] || translations['en']?.[key] || key;

    // Replace parameters in translation
    Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
    });

    return translation;
}

/**
 * Change language and update all translations on page
 * @param {string} lang - Language code ('en', 'es', 'pt')
 */
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language '${lang}' not supported`);
        return;
    }

    currentLang = lang;
    localStorage.setItem('padelflow_language', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const params = element.getAttribute('data-i18n-params');

        const parsedParams = params ? JSON.parse(params) : {};
        const translation = t(key, parsedParams);

        // Check if we should update innerHTML or a specific attribute
        const attr = element.getAttribute('data-i18n-attr');
        if (attr) {
            element.setAttribute(attr, translation);
        } else {
            element.innerHTML = translation;
        }
    });

    console.log(`✅ Language changed to: ${lang}`);
}

/**
 * Initialize translations on page load
 */
function initI18n() {
    // Apply translations to all elements with data-i18n
    changeLanguage(currentLang);

    console.log(`🌍 i18n initialized with language: ${currentLang}`);
}

/**
 * Get current language
 * @returns {string} Current language code
 */
function getCurrentLanguage() {
    return currentLang;
}

/**
 * Get available languages
 * @returns {array} Array of language codes
 */
function getAvailableLanguages() {
    return Object.keys(translations);
}

// Auto-initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
