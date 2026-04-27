gsap.registerPlugin(ScrollTrigger);

// 1. LENIS (Scroll Suave)
const lenis = new Lenis({ duration: 1.1, wheelMultiplier: 1 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));

// 2. HERO MASK
const updateMask = (x, y) => {
    document.documentElement.style.setProperty('--mask-x', `${(x / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty('--mask-y', `${(y / window.innerHeight) * 100}%`);
};
window.addEventListener("mousemove", (e) => updateMask(e.clientX, e.clientY));
gsap.to(document.documentElement, { '--mask-size': window.innerWidth < 768 ? '150px' : '280px', duration: 2 });

window.onload = () => {
    ScrollTrigger.refresh();

    // --- TIMELINE CORDA BAMBA ---
    const cordaTL = gsap.timeline({
        scrollTrigger: {
            trigger: "#section-corda-bamba",
            start: "top top",
            end: "+=800",
            scrub: 1,
            pin: true,
            onLeave: () => gsap.set("#section-corda-bamba", { opacity: 0 }),
            onEnterBack: () => gsap.set("#section-corda-bamba", { opacity: 1 })
        }
    });

    cordaTL
        .to(".layer-gui", { opacity: 1, duration: 1 })
        .to(".layer-title", { opacity: 1, scale: 1, duration: 1 }, "-=0.7")
        .to("#gui-personagem", { rotation: 1, x: 5, duration: 0.4, repeat: 1, yoyo: true });

    // --- VIVER NOVAMENTE ---
    gsap.to(".reveal-text .dim", {
        scrollTrigger: {
            trigger: "#viver-novamente",
            start: "top 95%",
            end: "top 20%",
            scrub: true
        },
        color: "white",
        stagger: 0.05
    });

    // --- CARROSSEL 3D PINNED ---
    const track = document.querySelector('.carousel-3d-track');
    const items = document.querySelectorAll('.carousel-item');

    if (track) {
        const carouselTL = gsap.timeline({
            scrollTrigger: {
                trigger: "#album-carousel",
                start: "top top",
                end: "+=2000", // Distância para percorrer as fotos
                scrub: 1.5,
                pin: true,
                anticipatePin: 1
            }
        });

        // Move o trilho horizontalmente
        carouselTL.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth / 1.5),
            ease: "none"
        });

        // Rotação individual de cada capa
        items.forEach((item) => {
            gsap.fromTo(item, 
                { rotateY: 35, scale: 0.8, opacity: 0.3 },
                {
                    rotateY: -35, scale: 1, opacity: 1,
                    scrollTrigger: {
                        trigger: item,
                        start: "left right",
                        end: "right left",
                        scrub: true,
                        containerAnimation: carouselTL
                    }
                }
            );

            // Toggle de classe ativa para o brilho DarkGray
            ScrollTrigger.create({
                trigger: item,
                containerAnimation: carouselTL,
                start: "left center+=150",
                end: "right center-=150",
                onToggle: self => {
                    if(self.isActive) item.classList.add('active');
                    else item.classList.remove('active');
                }
            });
        });
    }

    // --- VINYL LOGIC ---
const playlist = [
    { name: "Aleluia", artist: "Gui Neris", cover: "bici.png", src: "aleluia.mp3" },
    { name: "Baile de Máscaras", artist: "Gui Neris", cover: "carinha.png", src: "baile.mp3" },
    { name: "Ossos Secos", artist: "Gui Neris", cover: "corda.png", src: "ossos.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;
const audio = document.getElementById('main-audio');
const disk = document.getElementById('disk');
const tonearm = document.getElementById('tonearm');
const vinylTrigger = document.getElementById('vinyl-trigger');

// Rotação infinita controlada pelo GSAP
const rotationAnim = gsap.to(disk, {
    rotation: 360,
    duration: 3,
    repeat: -1,
    ease: "none",
    paused: true
});

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        rotationAnim.pause();
        document.querySelector('.vinyl-container').classList.remove('playing');
    } else {
        audio.play();
        rotationAnim.play();
        document.querySelector('.vinyl-container').classList.add('playing');
    }
    isPlaying = !isPlaying;
}

function changeTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    const track = playlist[currentTrackIndex];
    
    // Animação de troca (fade out/in)
    gsap.to(".vinyl-container", { opacity: 0, duration: 0.3, onComplete: () => {
        audio.src = track.src;
        document.getElementById('track-name').innerText = track.name;
        document.getElementById('artist-name').innerText = track.artist;
        document.querySelector('#current-cover img').src = track.cover;
        
        gsap.to(".vinyl-container", { opacity: 1, duration: 0.3 });
        
        if (isPlaying) audio.play();
    }});
}

// Eventos
vinylTrigger.addEventListener('click', (e) => {
    // Detecta double click manualmente para maior controle
    if (e.detail === 2) {
        changeTrack();
    } else {
        // Delay simples para não dar play no primeiro clique do double click
        setTimeout(() => { if (e.detail === 1) togglePlay(); }, 200);
    }
});

// --- LIQUID SOCIAL HOVER EFFECT ---
document.querySelectorAll('.liquid-btn').forEach(btn => {
    const color = btn.getAttribute('data-color');
    
    btn.addEventListener('mouseenter', () => {
        gsap.to('.social-liquid-section', {
            backgroundColor: 'rgba(' + hexToRgb(color) + ', 0.03)',
            duration: 0.6
        });
        gsap.to(btn.querySelector('.liquid-glass'), {
            borderColor: color,
            duration: 0.4
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to('.social-liquid-section', { backgroundColor: '#000', duration: 0.6 });
        gsap.to(btn.querySelector('.liquid-glass'), { borderColor: 'rgba(255,255,255,0.08)', duration: 0.4 });
    });
});

// Helper para converter Hex para RGB
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return r + ',' + g + ',' + b;
}

    // --- FOOTER ---
    gsap.to(".signature-reveal", {
        scrollTrigger: { trigger: "footer", start: "top 85%" },
        y: 0, opacity: 1, duration: 1.2
    });
};

// 4. MAGNETIC EFFECT
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const pos = btn.getBoundingClientRect();
        const x = (e.clientX - pos.left - pos.width / 2) * 0.4;
        const y = (e.clientY - pos.top - pos.height / 2) * 0.4;
        gsap.to(btn, { x, y, duration: 0.6 });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
    });
});