<?php

return [
    /*
     * Enable or disable notification sounds globally
     */
    'enabled' => env('FILAMENT_NOTIFICATION_SOUND_ENABLED', true),
    /*
     * Path to the notification sound file
     */
    'sound_path' => env('FILAMENT_NOTIFICATION_SOUND_PATH', '/sounds/notification.mp3'),
    /*
     * Enable or disable notification badge animation
     */
    'show_animation' => env('FILAMENT_NOTIFICATION_SOUND_ANIMATION', true),
    /*
     * Volume level (0.0 to 1.0)
     */
    'volume' => env('FILAMENT_NOTIFICATION_SOUND_VOLUME', 1.0),
    /*
     * Custom selectors for notification badge detection
     * Leave empty to use defaults
     */
    'selectors' => [],
];
