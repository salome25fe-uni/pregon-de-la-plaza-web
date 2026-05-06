// ============================================
    // INTERACCIÓN HERO: EL LENTE DE LA MEMORIA (PARCHEADO)
    // ============================================
    const heroSection = document.querySelector('.hero');
    const colorLayer = document.querySelector('.hero-bg-color');

    if(heroSection && colorLayer) {
        heroSection.addEventListener('mousemove', (e) => {
            // Calculamos la posición exacta dentro de la sección
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Animamos directamente las variables CSS (¡Esto nunca falla!)
            gsap.to(colorLayer, {
                '--mask-x': `${x}px`,
                '--mask-y': `${y}px`,
                '--mask-r': '250px', // El tamaño del lente
                duration: 0.3, 
                ease: "power2.out"
            });
            
            // Efecto parallax sutil para los textos
            const xPos = (x / rect.width - 0.5);
            const yPos = (y / rect.height - 0.5);
            gsap.to('.hero-title', { x: -xPos * 30, y: -yPos * 30, duration: 1 });
            gsap.to('.hero-script', { x: -xPos * 60, y: -yPos * 60, duration: 1 });
        });

        heroSection.addEventListener('mouseleave', () => {
            // Al salir, solo reducimos el radio a 0 para cerrar el círculo
            gsap.to(colorLayer, {
                '--mask-r': '0px',
                duration: 0.8, 
                ease: "power3.out"
            });
            gsap.to(['.hero-title', '.hero-script'], { x: 0, y: 0, duration: 1 });
        });
    }