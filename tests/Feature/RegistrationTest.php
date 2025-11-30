<?php

use Moataz01\FilamentNotificationSound\FilamentNotificationSoundPlugin;
use Filament\Facades\Filament;

it('can register plugin', function () {
    $plugin = FilamentNotificationSoundPlugin::make();
    
    expect($plugin)
        ->toBeInstanceOf(FilamentNotificationSoundPlugin::class)
        ->getId()->toBe('filament-notification-sound');
});

it('can configure plugin', function () {
    $plugin = FilamentNotificationSoundPlugin::make()
        ->soundPath('/custom/sound.mp3')
        ->volume(0.5)
        ->showAnimation(false);
        
    // We can't easily access protected properties, but we can verify the object is returned
    expect($plugin)->toBeInstanceOf(FilamentNotificationSoundPlugin::class);
});
