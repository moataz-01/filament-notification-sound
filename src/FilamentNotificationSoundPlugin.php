<?php

namespace Moataz01\FilamentNotificationSound;

use Closure;
use Filament\Contracts\Plugin;
use Filament\Panel;
use Filament\Support\Concerns\EvaluatesClosures;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

class FilamentNotificationSoundPlugin implements Plugin
{
    use EvaluatesClosures;

    protected string | Closure $soundPath = '/sounds/notification.mp3';

    protected bool | Closure $enabled = true;

    protected bool | Closure $showAnimation = true;

    protected float | Closure $volume = 1.0;

    protected array | Closure $selectors = [];

    public function getId(): string
    {
        return 'filament-notification-sound';
    }

    public function register(Panel $panel): void
    {
        if (! $this->evaluate($this->enabled)) {
            return;
        }
        $panel->renderHook(
            PanelsRenderHook::BODY_END,
            fn (): string => Blade::render(
                '<script>window.filamentNotificationSoundConfig = @js($config)</script>',
                [
                    'config' => [
                        'soundPath' => $this->evaluate($this->soundPath),
                        'showAnimation' => $this->evaluate($this->showAnimation),
                        'volume' => $this->evaluate($this->volume),
                        'selectors' => $this->evaluate($this->selectors),
                    ],
                ]
            )
        );
    }

    public function boot(Panel $panel): void
    {
        // Plugin boot logic (if needed)
    }

    public static function make(): static
    {
        return app(static::class);
    }

    public static function get(): static
    {
        return filament(app(static::class)->getId());
    }

    // Fluent configuration methods
    public function soundPath(string | Closure $path): static
    {
        $this->soundPath = $path;

        return $this;
    }

    public function enabled(bool | Closure $condition = true): static
    {
        $this->enabled = $condition;

        return $this;
    }

    public function showAnimation(bool | Closure $show = true): static
    {
        $this->showAnimation = $show;

        return $this;
    }

    public function volume(float | Closure $volume): static
    {
        $this->volume = $volume;

        return $this;
    }

    public function selectors(array | Closure $selectors): static
    {
        $this->selectors = $selectors;

        return $this;
    }
}
