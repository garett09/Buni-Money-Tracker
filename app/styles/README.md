# Liquid Design System

A comprehensive CSS design system inspired by Apple's liquid design language, featuring glassmorphism, smooth animations, and responsive design.

## File Structure

```
app/styles/
├── variables.css          # CSS custom properties and design tokens
├── browser-support.css    # Browser compatibility and fallbacks
├── performance.css        # Performance optimizations
├── responsive.css         # Responsive design utilities
├── utilities.css          # Utility classes and components
└── README.md             # This documentation
```

## Features

### 🌊 Liquid Design Elements
- **Liquid Cards**: Glassmorphism with morphing border-radius
- **Liquid Buttons**: Smooth scaling and shimmer effects
- **Liquid Inputs**: Focus animations with scaling
- **Liquid Progress Bars**: Animated progress with flowing effects
- **Liquid Shapes**: Organic morphing animations

### 🎨 Design System
- **CSS Custom Properties**: Centralized design tokens
- **Apple-inspired Colors**: iOS 26 color palette
- **Typography**: SF Pro Display and SF Pro Text fonts
- **Spacing**: Consistent spacing scale
- **Shadows**: Layered shadow system

### 📱 Responsive Design
- **Mobile-first approach**: Optimized for all screen sizes
- **Touch-friendly**: 44px minimum touch targets
- **Adaptive animations**: Reduced motion on mobile
- **Container queries**: Modern responsive patterns

### ⚡ Performance
- **GPU acceleration**: Hardware-accelerated animations
- **Optimized animations**: 60fps smooth performance
- **Reduced motion support**: Accessibility compliance
- **Memory optimization**: Efficient CSS containment

### 🌐 Browser Support
- **Modern browsers**: Full feature support
- **Legacy browsers**: Graceful fallbacks
- **Safari optimizations**: WebKit-specific enhancements
- **Firefox compatibility**: Mozilla-specific fixes

## Usage

### Basic Liquid Card
```html
<div class="liquid-card liquid-space-lg">
  <h3 class="liquid-text-xl">Card Title</h3>
  <p class="liquid-text-base">Card content goes here</p>
</div>
```

### Liquid Button
```html
<button class="liquid-button liquid-space-md liquid-hover">
  Click me
</button>
```

### Liquid Input
```html
<input 
  type="text" 
  class="liquid-input liquid-space-md liquid-focus"
  placeholder="Enter text..."
/>
```

### Liquid Progress Bar
```html
<div class="liquid-progress">
  <div class="liquid-progress-fill" style="width: 75%"></div>
</div>
```

### Liquid Shapes
```html
<div class="liquid-shape-1 liquid-glass-md">
  Morphing shape
</div>
```

## CSS Custom Properties

### Colors
```css
--liquid-primary: #007AFF;
--liquid-secondary: #5856D6;
--liquid-success: #34C759;
--liquid-warning: #FF9500;
--liquid-error: #FF3B30;
```

### Glass Effects
```css
--liquid-glass-bg: rgba(255, 255, 255, 0.08);
--liquid-glass-border: rgba(255, 255, 255, 0.15);
--liquid-blur-md: 40px;
--liquid-saturate-md: 150%;
```

### Spacing
```css
--liquid-space-sm: 0.75rem;
--liquid-space-md: 1rem;
--liquid-space-lg: 1.5rem;
--liquid-space-xl: 2rem;
```

### Animations
```css
--liquid-duration-normal: 0.3s;
--liquid-ease-apple: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

## Responsive Breakpoints

- **sm**: 576px and up
- **md**: 768px and up
- **lg**: 992px and up
- **xl**: 1200px and up
- **2xl**: 1400px and up

## Accessibility

- **Reduced motion**: Respects `prefers-reduced-motion`
- **High contrast**: Supports `prefers-contrast: high`
- **Touch targets**: Minimum 44px for touch devices
- **Focus indicators**: Clear focus states
- **Screen readers**: Semantic HTML support

## Performance Tips

1. **Use GPU acceleration**: Elements with `transform: translateZ(0)`
2. **Optimize animations**: Use `will-change` sparingly
3. **Reduce repaints**: Use `contain: layout style paint`
4. **Mobile optimization**: Reduce blur effects on mobile
5. **Memory management**: Use `isolation: isolate`

## Browser Support

- **Chrome**: 88+
- **Firefox**: 87+
- **Safari**: 14+
- **Edge**: 88+
- **iOS Safari**: 14+
- **Android Chrome**: 88+

## Fallbacks

- **Backdrop filter**: Solid background fallback
- **CSS Grid**: Flexbox fallback
- **Custom properties**: Static values fallback
- **Animations**: Static states fallback

## Contributing

When adding new styles:

1. Use CSS custom properties for consistency
2. Add responsive variants
3. Include accessibility considerations
4. Add performance optimizations
5. Test across browsers
6. Update documentation

## License

This design system is part of the Buni Money Tracker project.
