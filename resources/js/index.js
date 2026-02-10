import '../css/index.css'

document.addEventListener('livewire:initialized', () => {
    const defaultConfig = {
        soundPath: '/sounds/notification.mp3',
        showAnimation: true,
        volume: 1.0,
        selectors: [],
        timeouts: {
            pollDelay: 50,
            animationDuration: 1000,
            tooltipShowDuration: 3000,
            tooltipFadeDuration: 300,
            titleFlashInterval: 1000,
        },
    }

    const userConfig = window.filamentNotificationSoundConfig || {}

    // Validate and merge configuration
    const config = {
        ...defaultConfig,
        ...userConfig,
        volume: Math.max(
            0,
            Math.min(1, userConfig.volume ?? defaultConfig.volume),
        ),
        timeouts: {
            ...defaultConfig.timeouts,
            ...(userConfig.timeouts || {}),
        },
    }

    // Validate timeout values
    Object.keys(config.timeouts).forEach((key) => {
        if (
            typeof config.timeouts[key] !== 'number' ||
            config.timeouts[key] < 0
        ) {
            console.warn(`Invalid timeout for ${key}, using default value`)
            config.timeouts[key] = defaultConfig.timeouts[key]
        }
    })

    let unreadCount = 0
    const audio = new Audio(config.soundPath)
    audio.volume = config.volume
    let audioUnlocked = false

    const unlockAudio = () => {
        if (audioUnlocked) return

        // Attempt to play and immediately pause to unlock audio capability
        audio
            .play()
            .then(() => {
                audio.pause()
                audio.currentTime = 0
                audioUnlocked = true

                removeUnlockListeners()
            })
            .catch((error) => {
                console.warn('Failed to unlock audio:', error)
            })
    }

    const removeUnlockListeners = () => {
        document.removeEventListener('click', unlockAudio)
        document.removeEventListener('keydown', unlockAudio)
        document.removeEventListener('touchstart', unlockAudio)
    }

    // Listen for user interaction to unlock audio
    document.addEventListener('click', unlockAudio)
    document.addEventListener('keydown', unlockAudio)
    document.addEventListener('touchstart', unlockAudio)

    const getUnreadCount = () => {
        // Try multiple selectors to find the notification badge
        const selectors = [
            '.fi-topbar-database-notifications-btn .fi-badge span', // Filament v5 structure
            '.fi-topbar-database-notifications-btn .fi-badge', // Fallback
            '.fi-icon-btn-badge-ctn .fi-badge', // Generic icon button badge
            '[x-ref="notifications-trigger"] span', // Common Filament v3
        ]

        for (const selector of selectors) {
            const el = document.querySelector(selector)
            if (el) {
                const count = parseInt(el.innerText)
                if (!isNaN(count)) {
                    return count
                }
            }
        }
        return 0
    }

    // Initialize count
    unreadCount = getUnreadCount()

    // Livewire v4 hook system
    if (window.Livewire && typeof window.Livewire.hook === 'function') {
        window.Livewire.hook('effect', ({ component }) => {
            // Poll for notification count changes
            setTimeout(() => {
                const newCount = getUnreadCount()

                if (newCount > unreadCount) {
                    audio.currentTime = 0
                    audio.play().catch((error) => {
                        console.warn(
                            'Failed to play notification sound:',
                            error,
                        )
                    })

                    // Trigger animation
                    if (config.showAnimation) {
                        const badgeSelectors = [
                            '.fi-topbar-database-notifications-btn', // Button wrapper
                            '.fi-icon-btn-badge-ctn', // Icon badge container
                            '[x-ref="notifications-trigger"]', // Fallback
                        ]

                        let animatedElement = null
                        for (const selector of badgeSelectors) {
                            const el = document.querySelector(selector)
                            if (el) {
                                animatedElement = el
                                break
                            }
                        }

                        if (animatedElement) {
                            animatedElement.classList.add('notification-pulse')
                            setTimeout(() => {
                                animatedElement.classList.remove(
                                    'notification-pulse',
                                )
                            }, config.timeouts.animationDuration) // Remove after animation completes

                            // Show Tooltip
                            let tooltip = animatedElement.querySelector(
                                '.notification-tooltip',
                            )
                            if (!tooltip) {
                                tooltip = document.createElement('div')
                                tooltip.className = 'notification-tooltip'
                                tooltip.innerText = 'New Notification!'

                                // Ensure parent is relative for absolute positioning
                                const computedStyle =
                                    window.getComputedStyle(animatedElement)
                                if (computedStyle.position === 'static') {
                                    animatedElement.style.position = 'relative'
                                }

                                animatedElement.appendChild(tooltip)
                            }

                            // Trigger reflow
                            void tooltip.offsetWidth
                            tooltip.classList.add('show')

                            setTimeout(() => {
                                tooltip.classList.remove('show')
                                setTimeout(() => {
                                    try {
                                        if (
                                            tooltip &&
                                            tooltip.parentNode &&
                                            tooltip.parentNode.contains(tooltip)
                                        ) {
                                            tooltip.parentNode.removeChild(
                                                tooltip,
                                            )
                                        }
                                    } catch (error) {
                                        console.warn(
                                            'Failed to remove tooltip:',
                                            error,
                                        )
                                    }
                                }, config.timeouts.tooltipFadeDuration) // Wait for transition
                            }, config.timeouts.tooltipShowDuration)
                        }
                    }

                    // Flash Title
                    const originalTitle = document.title
                    let flashState = false
                    const flashInterval = setInterval(() => {
                        document.title = flashState
                            ? originalTitle
                            : `🔔 ${newCount} New Notifications!`
                        flashState = !flashState
                    }, config.timeouts.titleFlashInterval)

                    // Stop flashing on user interaction
                    const stopFlashing = () => {
                        clearInterval(flashInterval)
                        document.title = originalTitle
                        document.removeEventListener('click', stopFlashing)
                        document.removeEventListener('keydown', stopFlashing)
                        document.removeEventListener('touchstart', stopFlashing)
                    }

                    document.addEventListener('click', stopFlashing)
                    document.addEventListener('keydown', stopFlashing)
                    document.addEventListener('touchstart', stopFlashing)
                }

                unreadCount = newCount
            }, config.timeouts.pollDelay)
        })
    }
})
