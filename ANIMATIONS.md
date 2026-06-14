# Transitions et Animations - Guide d'Utilisation

Ce document explique comment utiliser les composants d'animation dans le projet KAMI-EXTENSION.

## 📚 Composants d'Animation Disponibles

### 1. AnimatedScreen
Wrapper principal pour les transitions de page avec différentes animations.

```tsx
import { AnimatedScreen } from '@/components/AnimatedScreen';

<AnimatedScreen isActive={currentScreen === 'home'} animationType="slideUp">
  <VotreComposant />
</AnimatedScreen>
```

**Types d'animation disponibles :**
- `fadeIn` - Transition de fade simple
- `slideUp` - Slide vers le haut (défaut)
- `slideDown` - Slide vers le bas
- `slideLeft` - Slide depuis la gauche
- `slideRight` - Slide depuis la droite
- `scale` - Mise à l'échelle
- `bounce` - Effet de rebond
- `flip` - Effet de retournement
- `zoom` - Effet de zoom

---

### 2. AnimatedCard
Cartes avec animation d'entrée et effets de hover.

```tsx
import { AnimatedCard } from '@/components/AnimatedScreen';

<AnimatedCard index={0} className="hover-lift">
  <CardContent>Votre contenu</CardContent>
</AnimatedCard>
```

**Props :**
- `delay` (optionnel) - Délai avant l'animation (défaut: 0)
- `index` - Index pour le délai en cascade (défaut: 0)
- `hover` - Activer les effets de hover (défaut: true)
- `className` - Classes CSS additionnelles

---

### 3. AnimatedButton
Boutons avec animations interactives.

```tsx
import { AnimatedButton } from '@/components/AnimatedScreen';

<AnimatedButton variant="pulse" className="bg-purple-600">
  Cliquez-moi
</AnimatedButton>
```

**Variants disponibles :**
- `default` - Animation de scale au hover/tap
- `pulse` - Effet de pulse continu
- `bounce` - Effet de rebond continu

---

### 4. AnimatedListItem
Éléments de liste avec animation d'entrée en cascade.

```tsx
import { AnimatedListItem } from '@/components/AnimatedScreen';

{items.map((item, index) => (
  <AnimatedListItem key={item.id} index={index}>
    <Card>{item.content}</Card>
  </AnimatedListItem>
))}
```

---

### 5. AnimatedContainer
Conteneur avec animation en cascade de ses enfants.

```tsx
import { AnimatedContainer } from '@/components/AnimatedScreen';

<AnimatedContainer staggerDelay={0.1}>
  <Card>Élément 1</Card>
  <Card>Élément 2</Card>
  <Card>Élément 3</Card>
</AnimatedContainer>
```

---

### 6. Composants d'Animation Simples

#### FadeIn
```tsx
import { FadeIn } from '@/components/AnimatedScreen';

<FadeIn delay={0.2} duration={0.5}>
  <div>Contenu qui apparaît en fade</div>
</FadeIn>
```

#### ScaleIn
```tsx
import { ScaleIn } from '@/components/AnimatedScreen';

<ScaleIn delay={0.3}>
  <div>Contenu qui apparaît en scale</div>
</ScaleIn>
```

#### SlideIn
```tsx
import { SlideIn } from '@/components/AnimatedScreen';

<SlideIn delay={0.2} direction="right">
  <div>Contenu qui slide depuis la droite</div>
</SlideIn>
```

**Directions disponibles :** `left`, `right`, `up`, `down`

---

### 7. Animations Continues

#### Pulse
```tsx
import { Pulse } from '@/components/AnimatedScreen';

<Pulse>
  <Badge>Notification</Badge>
</Pulse>
```

#### Float
```tsx
import { Float } from '@/components/AnimatedScreen';

<Float>
  <div>Élément flottant</div>
</Float>
```

---

### 8. Shimmer (Loading)
```tsx
import { Shimmer } from '@/components/AnimatedScreen';

<Shimmer width="100%" height="200px" className="rounded-lg" />
```

---

## 🎨 Classes CSS d'Animation

### Transitions de Page
```html
<div class="animate-slide-in-up">...</div>
<div class="animate-slide-in-right">...</div>
<div class="animate-slide-in-left">...</div>
<div class="animate-fade-in">...</div>
<div class="animate-scale-in">...</div>
<div class="animate-bounce-in">...</div>
<div class="animate-flip-in">...</div>
<div class="animate-zoom-in">...</div>
```

### Animations Continues
```html
<div class="animate-float">...</div>
<div class="animate-subtle-pulse">...</div>
<div class="animate-shimmer">...</div>
```

### Effets de Hover
```html
<div class="hover-lift">...</div>
```

### Délais d'Animation
```html
<div class="animate-slide-in-up delay-100">...</div>
<div class="animate-slide-in-up delay-200">...</div>
<div class="animate-slide-in-up delay-300">...</div>
<div class="animate-slide-in-up delay-400">...</div>
<div class="animate-slide-in-up delay-500">...</div>
```

---

## 📱 Responsive Design

Les animations sont automatiquement optimisées pour les appareils mobiles :
- Durée d'animation réduite sur mobile (≤768px)
- Courbes d'assouplissement adaptées
- Support de `prefers-reduced-motion` pour l'accessibilité

---

## 🎯 Bonnes Pratiques

### 1. Utiliser les animations avec parcimonie
Les animations doivent améliorer l'expérience utilisateur, pas la distraire.

### 2. Maintenir des durées courtes
- Entrées de page: 0.4-0.6s
- Hover states: 0.2-0.3s
- Animations continues: 1.5-3s

### 3. Considérer la performance
- Utiliser `transform` et `opacity` au lieu de `left`, `top`, `width`, `height`
- Éviter trop d'animations simultanées
- Tester sur des appareils bas de gamme

### 4. Accessibilité
- Respecter `prefers-reduced-motion`
- Ne pas utiliser d'animations essentielles au contenu
- Fournir des alternatives visuelles

---

## 🔧 Personnalisation

### Modifier les animations dans `globals.css`

```css
@keyframes your-custom-animation {
  from {
    /* état initial */
  }
  to {
    /* état final */
  }
}

.your-animation-class {
  animation: your-custom-animation 0.5s ease-out forwards;
}
```

### Modifier les transitions dans `AnimatedScreen.tsx`

```tsx
const animationVariants: any = {
  yourAnimation: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.5, ease: 'easeInOut' }
  }
};
```

---

## 📖 Exemples d'Utilisation

### Page d'Accueil avec Animation
```tsx
<AnimatedScreen isActive={currentScreen === 'home'} animationType="slideUp">
  <FadeIn delay={0.2}>
    <h1>Bienvenue</h1>
  </FadeIn>
  <AnimatedContainer staggerDelay={0.1}>
    <FeatureCard />
    <FeatureCard />
    <FeatureCard />
  </AnimatedContainer>
</AnimatedScreen>
```

### Liste d'Items Animés
```tsx
<div className="space-y-4">
  {items.map((item, index) => (
    <AnimatedListItem key={item.id} index={index}>
      <Card className="hover-lift">{item.content}</Card>
    </AnimatedListItem>
  ))}
</div>
```

### Bouton avec Animation
```tsx
<AnimatedButton variant="pulse" className="bg-purple-600">
  Commencer
</AnimatedButton>
```

---

## 🐛 Dépannage

### Les animations ne fonctionnent pas
1. Vérifiez que Framer Motion est installé
2. Assurez-vous que le composant est monté
3. Vérifiez la console pour les erreurs

### Performances lentes
1. Réduisez le nombre d'animations simultanées
2. Utilisez `will-change: transform, opacity` pour les animations fréquentes
3. Testez sur différents appareils

### Mobile
1. Les durées sont automatiquement réduites
2. Vérifiez que les animations ne bloquent pas l'interaction

---

## 📚 Ressources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

---

## ✨ Conclusion

Ces composants et classes CSS offrent une large gamme d'animations pour créer une expérience utilisateur moderne et engageante. N'hésitez pas à expérimenter et à personnaliser selon vos besoins !