// ============================================
// LÓGICA DE INTERACCIÓN - PREGÓN DE LA PLAZA
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. MARQUESINA (TICKER) ───────────────────────────────────────────────
    const ticker = document.querySelector('.ticker');
    if (ticker) {
        let pos = 0;
        function animTicker() {
            pos -= 0.8;
            if (pos < -ticker.scrollWidth / 2) pos = 0;
            ticker.style.transform = `translateX(${pos}px)`;
            requestAnimationFrame(animTicker);
        }
        animTicker();
    }


    // ─── 2. ESTILOS INYECTADOS ────────────────────────────────────────────────
    const styleEl = document.createElement('style');
    styleEl.textContent = `

        /* Ocultar los hover-tiles originales del HTML */
        .hover-tiles { display: none !important; }

        /* Cada ítem es una banda de altura fija */
        .menu-item {
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid rgba(247,236,188,0.1);
            cursor: pointer;
        }
        .menu-item:first-child { border-top: 1px solid rgba(247,236,188,0.1); }

        /* Fondo fotográfico de la banda (oculto por defecto) */
        .menu-item-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            opacity: 0;
            transform: scale(1.08);
            transition:
                opacity   0.55s cubic-bezier(0.25,1,0.5,1),
                transform 0.7s  cubic-bezier(0.25,1,0.5,1);
            z-index: 0;
        }

        /* Gradiente encima de la foto para que el texto sea legible */
        .menu-item-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to right,
                rgba(53,53,53,0.92) 0%,
                rgba(53,53,53,0.55) 55%,
                rgba(53,53,53,0.15) 100%
            );
        }

        /* Hover: foto visible + sin escala */
        .menu-item:hover .menu-item-bg {
            opacity: 1;
            transform: scale(1);
        }

        /* El contenido (link + desc) va encima del fondo */
        .menu-item-content {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            padding: 18px 5% 18px 5%;
            gap: 48px;
        }

        /* Link principal — tamaño original grande */
        .menu-link {
            font-family: var(--font-disp);
            font-size: clamp(50px, 7vw, 100px) !important;
            line-height: 0.85 !important;
            color: var(--bone);
            text-transform: uppercase;
            white-space: nowrap;
            transform: translateY(100%);
            opacity: 0;
            display: inline-block;
            transition:
                color         0.25s ease,
                letter-spacing 0.3s  ease;
        }

        /* Entrada en cascada cuando el overlay está activo */
        .menu-overlay.is-active .menu-item:nth-child(1) .menu-link { transition-delay:0.07s; transform:translateY(0); opacity:1; }
        .menu-overlay.is-active .menu-item:nth-child(2) .menu-link { transition-delay:0.14s; transform:translateY(0); opacity:1; }
        .menu-overlay.is-active .menu-item:nth-child(3) .menu-link { transition-delay:0.21s; transform:translateY(0); opacity:1; }
        .menu-overlay.is-active .menu-item:nth-child(4) .menu-link { transition-delay:0.28s; transform:translateY(0); opacity:1; }
        .menu-overlay.is-active .menu-item:nth-child(5) .menu-link { transition-delay:0.35s; transform:translateY(0); opacity:1; }
        .menu-overlay.is-active .menu-item:nth-child(6) .menu-link { transition-delay:0.42s; transform:translateY(0); opacity:1; }

        /* Transición de entrada del texto (que estaba antes en el CSS) */
        .menu-link {
            transition:
                transform      0.7s cubic-bezier(0.77,0,0.175,1),
                opacity        0.7s ease,
                color          0.25s ease,
                letter-spacing 0.3s  ease !important;
        }

        /* Descripción a la derecha del link */
        .menu-desc {
            font-family: var(--font-body);
            font-size: 13px;
            line-height: 1.5;
            color: rgba(247,236,188,0.6);
            max-width: 280px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: 0;
            transform: translateX(-12px);
            transition: opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s;
        }

        /* Descripción visible al hover */
        .menu-item:hover .menu-desc {
            opacity: 1;
            transform: translateX(0);
        }

        /* Número del ítem */
        .menu-num {
            font-family: var(--font-disp);
            font-size: 13px;
            color: rgba(247,236,188,0.3);
            min-width: 32px;
            align-self: flex-start;
            margin-top: 12px;
        }

        /* Flecha que aparece al hover */
        .menu-arrow {
            margin-left: auto;
            font-size: 28px;
            color: var(--yellow);
            opacity: 0;
            transform: translateX(-16px);
            transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.25,1,0.5,1);
            flex-shrink: 0;
        }
        .menu-item:hover .menu-arrow {
            opacity: 1;
            transform: translateX(0);
        }

        /* Efecto: los otros ítems se atenúan */
        .menu-links:hover .menu-item:not(:hover) .menu-link {
            opacity: 0.22;
            transition: opacity 0.2s ease;
        }

        /* Color del link al hover — se sobreescribe por JS según el ítem */
        .menu-item:hover .menu-link {
            letter-spacing: 0.02em;
        }

        /* Línea de color que aparece a la izquierda al hover */
        .menu-item::before {
            content: '';
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 4px;
            transform: scaleY(0);
            transform-origin: bottom;
            transition: transform 0.4s cubic-bezier(0.25,1,0.5,1);
            z-index: 3;
        }
        .menu-item:hover::before {
            transform: scaleY(1);
        }

        /* Colores de la línea lateral por ítem */
        .menu-item:nth-child(1)::before { background: var(--yellow); }
        .menu-item:nth-child(2)::before { background: var(--green);  }
        .menu-item:nth-child(3)::before { background: var(--red);    }
        .menu-item:nth-child(4)::before { background: var(--yellow); }
        .menu-item:nth-child(5)::before { background: var(--green);  }
        .menu-item:nth-child(6)::before { background: var(--red);    }

        /* Color del link por ítem al hover */
        .menu-item:nth-child(1):hover .menu-link { color: var(--yellow) !important; }
        .menu-item:nth-child(2):hover .menu-link { color: var(--green)  !important; }
        .menu-item:nth-child(3):hover .menu-link { color: var(--red)    !important; }
        .menu-item:nth-child(4):hover .menu-link { color: var(--yellow) !important; }
        .menu-item:nth-child(5):hover .menu-link { color: var(--green)  !important; }
        .menu-item:nth-child(6):hover .menu-link { color: var(--red)    !important; }

        /* RESPONSIVE: en móvil las letras bajan un poco */
        @media (max-width: 600px) {
            .menu-link { font-size: clamp(36px, 10vw, 56px) !important; }
            .menu-item-content { gap: 16px; padding: 12px 5%; }
            .menu-desc  { display: none; }
            .menu-num   { display: none; }
        }
        
    `;
    document.head.appendChild(styleEl);


    // ─── 3. CONSTRUIR EL MENÚ ─────────────────────────────────────────────────
    const menuOverlay = document.getElementById('menuOverlay');
    const menuTrigger = document.getElementById('menuTrigger');
    const menuText    = document.querySelector('.menu-text');

    if (!menuTrigger || !menuOverlay) return;

    let menuOpen = false;

    // Datos de cada ítem: src de la primera imagen de sus hover-tiles
    const menuItems = Array.from(menuOverlay.querySelectorAll('.menu-item'));

    menuItems.forEach((item, idx) => {
        // ── 1. Fondo fotográfico ────────────────────────────────────────────
        const firstImg = item.querySelector('.hover-tiles img');
        const bg = document.createElement('div');
        bg.className = 'menu-item-bg';
        if (firstImg) bg.style.backgroundImage = `url('${firstImg.src}')`;
        item.insertBefore(bg, item.firstChild);

        // ── 2. Reestructurar menu-item-content ─────────────────────────────
        const content = item.querySelector('.menu-item-content');
        if (!content) return;

        // Número
        const num = document.createElement('span');
        num.className   = 'menu-num';
        num.textContent = String(idx + 1).padStart(2, '0');
        content.insertBefore(num, content.firstChild);

        // Flecha al final
        const arrow = document.createElement('span');
        arrow.className   = 'menu-arrow';
        arrow.textContent = '→';
        content.appendChild(arrow);
    });


    // ─── 4. ABRIR / CERRAR ────────────────────────────────────────────────────
    function openMenu() {
        menuOpen = true;
        menuOverlay.classList.add('is-active');
        if (menuText) menuText.textContent = 'CERRAR';
        menuTrigger.style.background = 'var(--red)';
        menuTrigger.style.color      = '#fff';
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuOpen = false;
        menuOverlay.classList.remove('is-active');
        if (menuText) menuText.textContent = 'MENÚ';
        menuTrigger.style.background = 'var(--bone)';
        menuTrigger.style.color      = 'var(--carbon)';
        document.body.style.overflow = 'auto';
    }

    menuTrigger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

});


// ─── 5. TABS ──────────────────────────────────────────────────────────────────
window.mostrarTab = function(tabId, event) {
    document.querySelectorAll('.contenido-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
};


// ─── ZOOM DE ENTRADA EN EL HERO ───────────────────────────────────────────────
// La imagen del hero empieza grande (scale 1.06) y hace zoom-out al cargar
(function() {
    const heroBg = document.querySelector('.hero-bg-img');
    if (!heroBg) return;
    if (heroBg.complete) {
        requestAnimationFrame(() => heroBg.classList.add('loaded'));
    } else {
        heroBg.addEventListener('load', () => heroBg.classList.add('loaded'));
    }
})();