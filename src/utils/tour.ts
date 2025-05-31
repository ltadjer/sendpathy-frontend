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
        text: 'Bienvenue sur le fil d’actualité ✨ ! C’est ici que vous pouvez lire les partages anonymes des autres membres et vous connecter à leurs émotions.',
        attachTo: { element: '#tab-feed', on: 'top' },
        buttons: [
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-journal',
        text: 'Le Journal de Vie vous permet de déposer vos pensées, vos moments forts ou vos réflexions personnelles, uniquement visibles par vous.',
        attachTo: { element: '#tab-journal', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-conversations',
        text: 'Envie de parler à quelqu’un ? 💬 Ici, vous pouvez échanger en toute confidentialité avec d’autres utilisateurs.',
        attachTo: { element: '#tab-conversations', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });


    tour.addStep({
        id: 'step-parameters',
        text: 'Personnalisez votre expérience ⚙️ : notifications, confidentialité, préférences… tout est ici.',
        attachTo: { element: '#tab-parameters', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-fab',
        text: 'Un moment à partager ? Cliquez ici pour poster anonymement et libérer ce que vous ressentez 🕊️.',
        attachTo: { element: 'ion-fab-button', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-notifications',
        text: 'Ne ratez rien 📬 : nouveaux messages, commentaires ou réactions, tout s’affiche ici.',
        attachTo: { element: '.custom-icon', on: 'top' },
        buttons: [
            { text: 'Précédent', action: tour.back },
            { text: 'Suivant', action: tour.next }
        ]
    });

    tour.addStep({
        id: 'step-finish',
        text: 'Et voilà 🎉 ! Vous êtes prêt·e à explorer Sendpathy. N’oubliez pas : ici, chaque émotion compte 💜',
        buttons: [{ text: 'Terminer', action: tour.complete }]
    });


    return tour;
}
