import siteData from '@/data/siteData.json';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BASE_PATH from '@/lib/basePath';

// Build a flat list of all events (from departments + creative + cultural) for lookup
function getAllEvents() {
    const events = [];
    siteData.departments.forEach(dept => {
        dept.departmentEvents.forEach(ev => {
            events.push({ ...ev, departmentId: dept.id, departmentName: dept.name, departmentIcon: dept.icon, departmentColor: dept.color });
        });
    });
    if (siteData.creativeEvents) {
        siteData.creativeEvents.forEach(ev => {
            events.push({ ...ev, eventType: 'creative' });
        });
    }
    if (siteData.culturalEvents) {
        siteData.culturalEvents.forEach(ev => {
            events.push({ ...ev, eventType: 'cultural' });
        });
    }
    siteData.events.forEach(ev => {
        if (!events.find(e => e.id === ev.id)) {
            events.push(ev);
        }
    });
    return events;
}

export async function generateStaticParams() {
    const allEvents = getAllEvents();
    const ids = new Set();
    allEvents.forEach(e => ids.add(e.id));
    siteData.events.forEach(e => ids.add(e.id));
    return Array.from(ids).map(id => ({ id: String(id) }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    let event = siteData.events.find(e => String(e.id) === String(id));
    if (!event) {
        const allEvents = getAllEvents();
        event = allEvents.find(e => String(e.id) === String(id));
    }
    if (!event) return {};
    return {
        title: `${event.title} — Tarang 2026 | GPTC Kannur`,
        description: event.desc,
    };
}

export default async function EventPage({ params }) {
    const { id } = await params;

    let event = siteData.events.find(e => String(e.id) === String(id));
    let deptEvent = null;
    let dept = null;
    let creativeEvent = null;
    let culturalEvent = null;

    siteData.departments.forEach(d => {
        d.departmentEvents.forEach(ev => {
            if (String(ev.id) === String(id)) {
                deptEvent = ev;
                dept = d;
            }
        });
    });

    if (siteData.creativeEvents) {
        creativeEvent = siteData.creativeEvents.find(ev => String(ev.id) === String(id));
    }
    if (siteData.culturalEvents) {
        culturalEvent = siteData.culturalEvents.find(ev => String(ev.id) === String(id));
    }

    if (!event && deptEvent) event = deptEvent;
    if (!event && creativeEvent) event = creativeEvent;
    if (!event && culturalEvent) event = culturalEvent;
    if (!event) notFound();

    const detailEvent = deptEvent || creativeEvent || culturalEvent;
    const fullEvent = detailEvent ? { ...event, ...detailEvent } : event;

    const eventType = creativeEvent ? 'creative' : culturalEvent ? 'cultural' : (dept ? 'technical' : 'general');
    const accentColor = dept?.color || (eventType === 'creative' ? '#a855f7' : eventType === 'cultural' ? '#e6236c' : '#f27b1a');

    const getThumb = (title) => {
        const t = title.toLowerCase();
        if (t.includes('quiz') || t.includes('brain') || t.includes('mechiq') || t.includes('puzzle')) return 'quiz.png';
        if (t.includes('bridge') || t.includes('tower') || t.includes('stick')) return 'bridge.png';
        if (t.includes('cad') || t.includes('autocad') || t.includes('mechcad')) return 'cad.png';
        if (t.includes('solder') || t.includes('hot joint') || t.includes('bugslayer') || t.includes('trace')) return 'soldering.png';
        if (t.includes('wiring') || t.includes('metal fab') || t.includes('proturn')) return 'wiring.png';
        if (t.includes('workshop') || t.includes('arduino') || t.includes('additive') || t.includes('sketchup')) return 'workshop.png';
        if (t.includes('fashion') || t.includes('drape') || t.includes('sketch to style') || t.includes('design decode') || t.includes('pureform')) return 'fashion.png';
        if (t.includes('photography') || t.includes('shorts') || t.includes('reels')) return 'photography.png';
        if (t.includes('dance')) return 'dance.png';
        if (t.includes('karaoke') || t.includes('song') || t.includes('music')) return 'music.png';
        if (t.includes('mehndi')) return 'mehndi.png';
        if (t.includes('art') || t.includes('poster') || t.includes('bottle') || t.includes('clay') || t.includes('face') || t.includes('caricature') || t.includes('graffiti')) return 'art.png';
        if (t.includes('seminar') || t.includes('project competition')) return 'seminar.png';
        return null;
    };
    const thumb = getThumb(fullEvent.title);
    const categoryLabel = eventType === 'creative' ? 'Creative Events' : eventType === 'cultural' ? 'Cultural Events' : 'Events';

    return (
        <>
            <nav className="navbar scrolled" style={{ position: 'relative' }}>
                <div className="nav-inner">
                    <Link href="/" className="nav-logo">
                        <img src={`${BASE_PATH}/assets/logo.png`} alt="Tarang" />
                        <span className="nav-logo-text">TARANG</span>
                    </Link>
                    <div className="nav-links">
                        <Link href="/#about">About</Link>
                        <Link href="/departments">Departments</Link>
                        <Link href="/#events">Events</Link>
                        <Link href="/#schedule">Schedule</Link>
                    </div>
                </div>
            </nav>

            <section className="event-detail-hero" style={{ '--accent': accentColor }}>
                <div className="event-detail-hero-bg">
                    {thumb ? (
                        <img src={`${BASE_PATH}/assets/events/${thumb}`} alt={fullEvent.title} className="event-detail-hero-img" />
                    ) : (
                        <div className="event-detail-hero-gradient" />
                    )}
                    <div className="event-detail-hero-overlay" />
                </div>
                <div className="container">
                    <div className="event-detail-hero-content">
                        <div className="dept-detail-breadcrumb">
                            <Link href="/">Home</Link>
                            <span className="dept-detail-breadcrumb-sep">/</span>
                            <Link href="/#events">{categoryLabel}</Link>
                            {dept && (
                                <>
                                    <span className="dept-detail-breadcrumb-sep">/</span>
                                    <Link href={`/departments/${dept.id}`}>{dept.name}</Link>
                                </>
                            )}
                            <span className="dept-detail-breadcrumb-sep">/</span>
                            <span className="dept-detail-breadcrumb-current">{fullEvent.title}</span>
                        </div>

                        {dept && (
                            <div className="event-detail-dept-badge" style={{ background: dept.color }}>
                                {dept.icon} {dept.name}
                            </div>
                        )}
                        {eventType === 'creative' && (
                            <div className="event-detail-dept-badge" style={{ background: '#a855f7' }}>
                                🎨 Creative Event
                            </div>
                        )}
                        {eventType === 'cultural' && (
                            <div className="event-detail-dept-badge" style={{ background: '#e6236c' }}>
                                🎭 Cultural Event
                            </div>
                        )}

                        <h1 className="event-detail-title">{fullEvent.title}</h1>
                        {fullEvent.subtitle && <div className="event-detail-subtitle">{fullEvent.subtitle}</div>}
                        <p className="event-detail-desc">{fullEvent.desc}</p>
                    </div>
                </div>
            </section>

            <section className="section event-detail-section">
                <div className="container">
                    <div className="event-detail-grid">
                        <div className="event-detail-main">
                            <div className="event-detail-info-card">
                                <h3 className="event-detail-info-title">Event Details</h3>
                                <div className="event-detail-info-grid">
                                    <div className="event-detail-info-item">
                                        <div className="event-detail-info-icon">📅</div>
                                        <div>
                                            <div className="event-detail-info-label">Date</div>
                                            <div className="event-detail-info-value">{fullEvent.date}</div>
                                        </div>
                                    </div>
                                    {fullEvent.time && (
                                        <div className="event-detail-info-item">
                                            <div className="event-detail-info-icon">⏰</div>
                                            <div>
                                                <div className="event-detail-info-label">Time</div>
                                                <div className="event-detail-info-value">{fullEvent.time}</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="event-detail-info-item">
                                        <div className="event-detail-info-icon">👥</div>
                                        <div>
                                            <div className="event-detail-info-label">Team</div>
                                            <div className="event-detail-info-value">{fullEvent.team}</div>
                                        </div>
                                    </div>
                                    {fullEvent.venue && (
                                        <div className="event-detail-info-item">
                                            <div className="event-detail-info-icon">📍</div>
                                            <div>
                                                <div className="event-detail-info-label">Venue</div>
                                                <div className="event-detail-info-value">{fullEvent.venue}</div>
                                            </div>
                                        </div>
                                    )}
                                    {fullEvent.fee && (
                                        <div className="event-detail-info-item">
                                            <div className="event-detail-info-icon">💰</div>
                                            <div>
                                                <div className="event-detail-info-label">Registration Fee</div>
                                                <div className="event-detail-info-value">{fullEvent.fee}</div>
                                            </div>
                                        </div>
                                    )}
                                    {fullEvent.prize && (
                                        <div className="event-detail-info-item">
                                            <div className="event-detail-info-icon">🏆</div>
                                            <div>
                                                <div className="event-detail-info-label">Prize Pool</div>
                                                <div className="event-detail-info-value">{fullEvent.prize}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {fullEvent.activityPoints && (
                                    <div className="event-detail-activity-badge">✅ Eligible for Activity Points</div>
                                )}
                                {fullEvent.openToAll && (
                                    <div className="event-detail-open-badge">🌐 Open to All Branches</div>
                                )}
                                {fullEvent.openToPublic && (
                                    <div className="event-detail-open-badge" style={{ background: 'rgba(168,85,247,0.15)', borderColor: 'rgba(168,85,247,0.3)' }}>
                                        🎉 Open to Public — No college ID required
                                    </div>
                                )}
                            </div>

                            {fullEvent.rules && fullEvent.rules.length > 0 && (
                                <div className="event-detail-info-card" style={{ marginTop: 24 }}>
                                    <h3 className="event-detail-info-title">📋 Rules &amp; Guidelines</h3>
                                    <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, color: 'rgba(255,255,255,0.85)' }}>
                                        {fullEvent.rules.map((rule, i) => (
                                            <li key={i} style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{rule}</li>
                                        ))}
                                    </ul>
                                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(242,123,26,0.08)', borderRadius: 10, border: '1px solid rgba(242,123,26,0.15)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                        <strong>General Rules:</strong> Carry any valid photo ID proof. Strictly follow the green campus protocol. Judges&apos; decision will be final.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="event-detail-sidebar">
                            {fullEvent.contacts && fullEvent.contacts.length > 0 && (
                                <div className="event-detail-contact-card">
                                    <h3 className="event-detail-contact-title">📞 Contact for Registration</h3>
                                    <div className="event-detail-contacts">
                                        {fullEvent.contacts.map((c, i) => (
                                            <div key={i} className="event-detail-contact-item">
                                                <div className="event-detail-contact-name">{c.name}</div>
                                                <a href={`tel:+91${c.phone}`} className="event-detail-contact-phone">📱 +91 {c.phone}</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="event-detail-register-card" style={{ '--accent': accentColor }}>
                                <h3>Ready to Participate?</h3>
                                <p>Register now and showcase your skills at Tarang 2026!</p>
                                <Link href="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Register Now</Link>
                            </div>

                            {dept && (
                                <Link href={`/departments/${dept.id}`} className="event-detail-dept-link" style={{ '--dept-color': dept.color }}>
                                    <span>{dept.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{dept.name}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>View all {dept.name} events →</div>
                                    </div>
                                </Link>
                            )}

                            {(eventType === 'creative' || eventType === 'cultural') && (
                                <Link href="/#events" className="event-detail-dept-link" style={{ '--dept-color': accentColor }}>
                                    <span>{eventType === 'creative' ? '🎨' : '🎭'}</span>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{eventType === 'creative' ? 'Creative Events' : 'Cultural Events'}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>View all {eventType} events →</div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom">
                        <p>© 2026 Tarang · GPTC Kannur. All rights reserved.</p>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <Link href="/#events" style={{ color: '#f27b1a' }}>← All Events</Link>
                            <Link href="/" style={{ color: '#f27b1a' }}>Home</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
