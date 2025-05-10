import Shepherd from 'shepherd.js';

export function createTour() {
    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            classes: 'custom-shepherd-popup', // Classe globale
            scrollTo: { behavior: 'smooth', block: 'center' },
            cancelIcon: { enabled: true }
        }
    });

    tour.addStep({
        id: 'step-feed',
        text: 'Ici se trouve le fil d’actualité (« Feed »). Cliquez pour voir tous les posts. ',
        attachTo: { element: '#tab-feed', on: 'top' },
        buttons: [
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-journal',
        text: 'Votre journal de vie :.',
        attachTo: { element: '#tab-journal', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-conversations',
        text: 'Ici, vous pouvez discuter avec vos amis.',
        attachTo: { element: '#tab-conversations', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-reservations',
        text: 'Gérez vos consultations de psy ici.',
        attachTo: { element: '#tab-reservations', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-parameters',
        text: 'Accédez aux paramètres pour personnaliser votre expérience.',
        attachTo: { element: '#tab-parameters', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-notifications',
        text: 'Consultez vos notifications ici.',
        attachTo: { element: '.custom-icon', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Terminer', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-fab',
        text: 'Exprimez-vous anonymement en cliquant sur ce bouton.',
        attachTo: { element: 'ion-fab', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-finish',
        text: 'Voilà pour la visite ! Bonne exploration 😊',
        buttons: [{ text: 'Terminer', action: tour.complete }]
    });

    return tour;
}
