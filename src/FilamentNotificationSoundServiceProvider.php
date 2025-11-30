<?php

namespace Moataz01\FilamentNotificationSound;

use Filament\Support\Assets\Css;
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentNotificationSoundServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-notification-sound';

    public function configurePackage(Package $package): void
    {
        $package
            ->name(static::$name)
            ->hasConfigFile()
            ->hasViews();
    }

    public function packageBooted(): void
    {
        // Register assets
        FilamentAsset::register([
            Js::make('filament-notification-sound', __DIR__ . '/../resources/dist/js/notification-sound.js'),
            Css::make('filament-notification-sound', __DIR__ . '/../resources/dist/css/notification-sound.css'),
        ], package: static::$name);
        // Publish sound files
        $this->publishes([
            __DIR__ . '/../resources/sounds' => public_path('sounds'),
        ], 'filament-notification-sound-sounds');
    }
}
