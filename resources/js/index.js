import '../css/index.css';

document.addEventListener('livewire:initialized', () => {
    const config = window.filamentNotificationSoundConfig || {
        soundPath: '/sounds/notification.mp3',
        showAnimation: true,
        volume: 1.0,
        selectors: []
    };

    let unreadCount = 0;
    const audio = new Audio(config.soundPath);
    audio.volume = config.volume;
    let audioUnlocked = false;

    const unlockAudio = () => {
        if (audioUnlocked) return;

        // Attempt to play and immediately pause to unlock audio capability
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            audioUnlocked = true;

            removeUnlockListeners();
        }).catch(error => {

        });
    };

    const removeUnlockListeners = () => {
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };

    // Listen for user interaction to unlock audio
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    const getUnreadCount = () => {
        // Try multiple selectors to find the notification badge
        const selectors = [
            '[x-ref="notifications-trigger"] span', // Common Filament v3
            '.fi-topbar-database-notifications-btn .fi-badge', // Alternative
            '[wire\\:click="openDatabaseNotifications"] .fi-badge', // Button trigger
            '.fi-icon-btn-badge' // Generic icon button badge
        ];

        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                const count = parseInt(el.innerText);
                if (!isNaN(count)) {
                    return count;
                }
            }
        }
        return 0;
    };

    // Initialize count
    unreadCount = getUnreadCount();


    Livewire.hook('commit', ({ component, commit, succeed, fail, respond }) => {
        succeed(({ snapshot, effect }) => {
            // Check if this component is related to notifications or contains the trigger
            if (component.name.includes('database-notifications') ||
                component.el.querySelector('[x-ref="notifications-trigger"]') ||
                component.el.querySelector('.fi-icon-btn-badge')) {

                // Small delay to ensure DOM is updated
                setTimeout(() => {
                    const newCount = getUnreadCount();


                    if (newCount > unreadCount) {
                        audio.currentTime = 0;
                        audio.play().catch(() => { });

                        // Trigger animation
                        if (config.showAnimation) {
                            const badgeSelectors = [
                                '[x-ref="notifications-trigger"]', // Icon wrapper
                                '.fi-topbar-database-notifications-btn', // Button wrapper
                                '.fi-icon-btn-badge' // Badge itself
                            ];

                            let animatedElement = null;
                            for (const selector of badgeSelectors) {
                                const el = document.querySelector(selector);
                                if (el) {
                                    animatedElement = el;
                                    break;
                                }
                            }

                            if (animatedElement) {
                                animatedElement.classList.add('notification-pulse');
                                setTimeout(() => {
                                    animatedElement.classList.remove('notification-pulse');
                                }, 4000); // Remove after 2 cycles (2s * 2)
                            }
                        }
                    }

                    unreadCount = newCount;
                }, 50);
            }
        });
    });
});