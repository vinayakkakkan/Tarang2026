'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import BASE_PATH from '@/lib/basePath';
import siteData from '@/data/siteData.json';

export default function RegisterPage() {
    const canvasRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.opacity = Math.random() * 0.5 + 0.2;
                const colors = ['242,123,26', '245,201,26', '230,69,37'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 40; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animId = requestAnimationFrame(animate);
        }
        animate();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    const pageStyle = `
        .reg-card {
            background: rgba(16, 26, 50, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 20px;
            padding: 50px 40px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }
        .reg-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 4px;
            background: var(--gradient-flame);
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .reg-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(242, 123, 26, 0.2);
            border-color: rgba(242, 123, 26, 0.4);
            z-index: 10;
        }
        .reg-card:hover::before {
            opacity: 1;
        }
        .reg-icon-wrapper {
            width: 90px;
            height: 90px;
            margin: 0 auto 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            transition: transform 0.5s ease;
        }
        .reg-card:hover .reg-icon-wrapper {
            transform: rotate(10deg) scale(1.1);
            background: rgba(242, 123, 26, 0.1);
            border-color: rgba(242, 123, 26, 0.3);
        }
        .reg-card h3 {
            font-family: var(--font-heading);
            font-size: 2rem;
            color: #fff;
            margin-bottom: 15px;
            letter-spacing: 0.5px;
        }
        .reg-card p {
            color: var(--text-secondary);
            font-size: 1.05rem;
            line-height: 1.6;
            margin-bottom: 35px;
        }
        .reg-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 16px 30px;
            border-radius: 50px;
            font-family: var(--font-heading);
            font-weight: 600;
            font-size: 1.1rem;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }
        .tech-btn {
            background: transparent;
            color: #fff;
            border: 2px solid var(--flame-orange);
            box-shadow: inset 0 0 0 0 var(--flame-orange);
        }
        .tech-btn:hover {
            box-shadow: inset 0 0 0 50px var(--flame-orange);
            color: #000;
            transform: translateY(-2px);
        }
        .cult-btn {
            background: transparent;
            color: #fff;
            border: 2px solid #e64525;
            box-shadow: inset 0 0 0 0 #e64525;
        }
        .cult-btn:hover {
            box-shadow: inset 0 0 0 50px #e64525;
            color: #fff;
            transform: translateY(-2px);
        }
        
        /* Entrance Animations */
        .fade-up-enter {
            opacity: 0;
            transform: translateY(40px);
            animation: fadeUpAnim 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeUpAnim {
            to { opacity: 1; transform: translateY(0); }
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
    `;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <style dangerouslySetInnerHTML={{ __html: pageStyle }} />

            {/* Background elements */}
            <div className="hero-bg" style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                <img src={`${BASE_PATH}/assets/hero-bg.png`} alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }} />
            </div>
            <div className="glow-orb glow-orb-orange" style={{ width: 500, height: 500, top: '10%', left: '-10%', opacity: 0.6 }} />
            <div className="glow-orb glow-orb-pink" style={{ width: 400, height: 400, bottom: '5%', right: '-5%', opacity: 0.5 }} />

            <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} />

            {/* Navbar */}
            <nav className="navbar scrolled">
                <div className="nav-inner">
                    <Link href="/" className="nav-logo">
                        <img src={`${BASE_PATH}/assets/logo.png`} alt="Tarang" />
                        <span className="nav-logo-text">TARANG</span>
                    </Link>
                    <div className="nav-links">
                        <Link href="/" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <section style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: '120px', paddingBottom: '80px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>

                    <div className={mounted ? 'fade-up-enter' : ''} style={{ textAlign: 'center', marginBottom: '60px', opacity: 0 }}>
                        <div className="section-label">— Join The Excitement —</div>
                        <h1 className="section-title" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '15px' }}>
                            Register for <span className="highlight">Tarang</span>
                        </h1>
                        <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>
                            Secure your spot in the most electrifying events. Choose your domain below to proceed to the registration portal.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>

                        {/* Technical Registration Card */}
                        <div className={`reg-card ${mounted ? 'fade-up-enter delay-2' : ''}`} style={{ opacity: 0 }}>
                            <div>
                                <div className="reg-icon-wrapper">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--flame-orange)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="16 18 22 12 16 6"></polyline>
                                        <polyline points="8 6 2 12 8 18"></polyline>
                                    </svg>
                                </div>
                                <h3>Technical Events</h3>
                                <p>
                                    Unleash your innovation! Register for Hackathons, Coding Challenges, Engineering Expos, and fierce logical battles crafted by all departments.
                                </p>
                            </div>
                            <div>
                                <a href="https://forms.gle/PJPCGefBoX8Qosua8" target="_blank" rel="noopener noreferrer" className="reg-btn tech-btn">
                                    <span>Register Now</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </a>
                            </div>
                        </div>

                        {/* Cultural Registration Card */}
                        <div className={`reg-card ${mounted ? 'fade-up-enter delay-3' : ''}`} style={{ opacity: 0 }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #e64525, #d4a017)', opacity: 0, transition: 'opacity 0.4s ease' }} className="cult-border-top" />
                            <div>
                                <div className="reg-icon-wrapper" style={{ borderColor: 'rgba(230, 69, 37, 0.2)' }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e64525" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18V5l12-2v13"></path>
                                        <circle cx="6" cy="18" r="3"></circle>
                                        <circle cx="18" cy="16" r="3"></circle>
                                    </svg>
                                </div>
                                <h3 style={{ background: 'linear-gradient(90deg, #fff, #ffddcc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Cultural and Creative Events
                                </h3>
                                <p>
                                    Let your creativity shine! Register for Dance, Music, Fine Arts, Photography, and a variety of spectacular stage performances.
                                </p>
                            </div>
                            <div>
                                <a href="https://forms.gle/JAtWKDSjsPRA5JtE9" target="_blank" rel="noopener noreferrer" className="reg-btn cult-btn">
                                    <span>Register Now</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
