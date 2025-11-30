# Filament Notification Sound

[![Latest Version on Packagist](https://img.shields.io/packagist/v/moataz-01/filament-notification-sound.svg?style=flat-square)](https://packagist.org/packages/moataz-01/filament-notification-sound)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/moataz-01/filament-notification-sound/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/moataz-01/filament-notification-sound/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/moataz-01/filament-notification-sound/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/moataz-01/filament-notification-sound/actions?query=workflow%3A"Fix+PHP+code+styling"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/moataz-01/filament-notification-sound.svg?style=flat-square)](https://packagist.org/packages/moataz-01/filament-notification-sound)

Add sound notifications to your Filament database notifications. This package plays a sound when a new database notification is received in the Filament admin panel.

## Installation

You can install the package via composer:

```bash
composer require moataz-01/filament-notification-sound
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="filament-notification-sound-config"
```

You can publish the sound files with:

```bash
php artisan vendor:publish --tag="filament-notification-sound-sounds"
```

## Usage

Register the plugin in your Filament Panel Provider:

```php
use Moataz01\FilamentNotificationSound\FilamentNotificationSoundPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->plugin(FilamentNotificationSoundPlugin::make());
}
```

## Configuration

You can configure the plugin using the fluent methods:

```php
use Moataz01\FilamentNotificationSound\FilamentNotificationSoundPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->plugin(
            FilamentNotificationSoundPlugin::make()
                ->soundPath('/sounds/custom-notification.mp3') // Custom sound path
                ->volume(0.5) // Volume (0.0 to 1.0)
                ->showAnimation(true) // Show animation on notification
                ->enabled(true) // Enable/disable the plugin
        );
}
```

## Customization

### Custom Sound

To use a custom sound, place your audio file in the `public` directory (e.g., `public/sounds/my-sound.mp3`) and configure the plugin to use it:

```php
FilamentNotificationSoundPlugin::make()
    ->soundPath('/sounds/my-sound.mp3')
```

## Publishing Assets

If you need to customize the assets, you can publish them:

```bash
php artisan vendor:publish --tag="filament-notification-sound-assets"
```

## Troubleshooting

If the sound is not playing:
1. Ensure the sound file exists in the specified path.
2. Check the browser console for any errors.
3. Verify that the user has interacted with the document (browsers block auto-playing audio without user interaction).

## Testing

```bash
composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Moataz](https://github.com/moataz-01)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
