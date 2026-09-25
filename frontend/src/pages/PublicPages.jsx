import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import {
  getArticles,
  getArticleById,
  getEvents,
  getEventById,
  getGallery,
  getSolutions,
  getSolutionById,
  getCaseStudies,
  getCaseStudyById,
} from "../api";
import "./PublicPages.css";

/* ─── Articles list ──────────────────────────────────────────────────────── */
export function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getArticles()
      .then((r) => setArticles(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-hero">
          <span className="tag">Insights</span>
          <h1>Articles</h1>
          <p>
            Thought leadership, industry insights, and updates from the
            AI-Solutions team.
          </p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : articles.length === 0 ? (
          <div className="state-box">
            <h3>No articles yet</h3>
            <p>Check back soon for the latest insights.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((a) => (
              <article
                key={a._id}
                className="card card-hover article-card"
                onClick={() => navigate(`/articles/${a._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(`/articles/${a._id}`)
                }
              >
                <div className="article-meta">
                  <Calendar size={12} />
                  {new Date(a.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h3>{a.title}</h3>
                <p className="muted">{a.body.substring(0, 155)}…</p>
                <span className="article-read">Read article →</span>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Article detail ─────────────────────────────────────────────────────── */
export function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticleById(id)
      .then((r) => setArticle(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page-wrapper">
      <div className="container detail-page-shell">
        <button
          className="btn btn-outline btn-sm back-btn"
          onClick={() => navigate("/articles")}
        >
          <ArrowLeft size={13} /> Back to Articles
        </button>
        {loading ? (
          <div className="spinner" />
        ) : !article ? (
          <div className="state-box">
            <h3>Article not found.</h3>
          </div>
        ) : (
          <div className="detail-shell">
            <section className="detail-card detail-card--hero">
              <div className="detail-hero__media detail-hero__media--article">
                <div className="detail-hero__fallback">AI</div>
              </div>
              <div className="detail-hero__content">
                <span className="badge badge-industry">Insight</span>
                <h1>{article.title}</h1>
                <p className="detail-hero__subtitle">
                  Practical thinking, strategy notes, and fresh perspectives
                  from our team.
                </p>
                <div className="detail-hero__meta">
                  <span className="detail-pill">
                    <Calendar size={12} />
                    {new Date(article.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </section>

            <section className="detail-card detail-card--content">
              <div className="detail-section-title">
                <span className="tag">Article</span>
                <h2>Read the full story</h2>
              </div>
              <div className="article-body muted">{article.body}</div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Events ─────────────────────────────────────────────────────────────── */
export function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents()
      .then((r) => setEvents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.eventDate) - new Date(b.eventDate),
  );
  const upcomingEvents = sortedEvents.filter(
    (ev) => new Date(ev.eventDate) >= now,
  );
  const pastEvents = sortedEvents.filter((ev) => new Date(ev.eventDate) < now);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-hero">
          <span className="tag">Community</span>
          <h1>Events</h1>
          <p>
            Discover upcoming sessions and look back at the events that shaped
            our community conversations.
          </p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : events.length === 0 ? (
          <div className="state-box">
            <h3>No events yet</h3>
            <p>Follow us on LinkedIn to stay updated.</p>
          </div>
        ) : (
          <div className="events-stack">
            {upcomingEvents.length > 0 && (
              <section className="events-section">
                <div className="events-section-title">
                  <h2>Upcoming events</h2>
                  <span className="events-section-pill">Next to join</span>
                </div>
                <div className="events-list">
                  {upcomingEvents.map((ev) => {
                    const isUpcoming = new Date(ev.eventDate) >= now;
                    return (
                      <div
                        key={ev._id}
                        className={`card event-card ${isUpcoming ? "" : "event-card--past"}`}
                      >
                        <div className="event-date">
                          <span>
                            {new Date(ev.eventDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                            })}
                          </span>
                          <span>
                            {new Date(ev.eventDate).toLocaleDateString("en-GB", {
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="event-info">
                          <span
                            className={`event-status-badge ${isUpcoming ? "upcoming" : "past"}`}
                          >
                            {isUpcoming ? "Upcoming" : "Past"}
                          </span>
                          <h3>{ev.title}</h3>
                          <p className="muted">{ev.description}</p>
                          {ev.location && (
                            <span className="event-location">
                              <MapPin size={12} />
                              {ev.location}
                            </span>
                          )}
                        </div>
                        <div className="event-actions">
                          <span className="event-time muted">
                            {new Date(ev.eventDate).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/events/${ev._id}`)}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {pastEvents.length > 0 && (
              <section className="events-section">
                <div className="events-section-title">
                  <h2>Past events</h2>
                  <span className="events-section-pill past">Highlights</span>
                </div>
                <div className="events-list">
                  {pastEvents.map((ev) => {
                    const isUpcoming = new Date(ev.eventDate) >= now;
                    return (
                      <div
                        key={ev._id}
                        className={`card event-card ${isUpcoming ? "" : "event-card--past"}`}
                      >
                        <div className="event-date">
                          <span>
                            {new Date(ev.eventDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                            })}
                          </span>
                          <span>
                            {new Date(ev.eventDate).toLocaleDateString("en-GB", {
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="event-info">
                          <span
                            className={`event-status-badge ${isUpcoming ? "upcoming" : "past"}`}
                          >
                            {isUpcoming ? "Upcoming" : "Past"}
                          </span>
                          <h3>{ev.title}</h3>
                          <p className="muted">{ev.description}</p>
                          {ev.location && (
                            <span className="event-location">
                              <MapPin size={12} />
                              {ev.location}
                            </span>
                          )}
                        </div>
                        <div className="event-actions">
                          <span className="event-time muted">
                            {new Date(ev.eventDate).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`/events/${ev._id}`)}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const eventImages = galleryImages.filter(
    (img) => (img.eventId?._id || img.eventId) === id,
  );

  useEffect(() => {
    getEventById(id)
      .then((r) => setEvent(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getGallery()
      .then((r) => setGalleryImages(r.data))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (selectedImageIndex === null) return;
    const handler = (e) => {
      if (e.key === "Escape") setSelectedImageIndex(null);
      if (e.key === "ArrowRight")
        setSelectedImageIndex((i) => Math.min(i + 1, eventImages.length - 1));
      if (e.key === "ArrowLeft")
        setSelectedImageIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedImageIndex, eventImages.length]);
  const currentImage =
    selectedImageIndex !== null ? eventImages[selectedImageIndex] : null;

  return (
    <div className="page-wrapper">
      <div className="container detail-page-shell">
        <button
          className="btn btn-outline btn-sm back-btn"
          onClick={() => navigate("/events")}
        >
          <ArrowLeft size={13} /> Back to Events
        </button>
        {loading ? (
          <div className="spinner" />
        ) : !event ? (
          <div className="state-box">
            <h3>Event not found.</h3>
          </div>
        ) : (
          <div className="detail-shell">
            <section className="detail-card detail-card--hero">
              <div className="detail-hero__media detail-hero__media--event">
                <div className="detail-hero__fallback">EV</div>
              </div>
              <div className="detail-hero__content">
                <span className="badge badge-industry">Upcoming event</span>
                <h1>{event.title}</h1>
                <p className="detail-hero__subtitle">
                  {event.location
                    ? `Join our team in ${event.location} for a live session and conversation.`
                    : "Join our team for a live session and conversation about practical AI adoption."}
                </p>
                <div className="detail-hero__meta">
                  <span className="detail-pill">
                    <Calendar size={12} />
                    {new Date(event.eventDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {event.location && (
                    <span className="detail-pill">
                      <MapPin size={12} />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="detail-card detail-card--content">
              <div className="detail-section-title">
                <span className="tag">Event overview</span>
                <h2>About this session</h2>
              </div>
              <div className="article-body muted">{event.description}</div>
              <div className="detail-actions">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/contact", { state: { interest: event.title } })
                  }
                >
                  Register / Enquire
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() =>
                    navigate("/gallery", {
                      state: { eventId: event._id, eventTitle: event.title },
                    })
                  }
                >
                  View related photos
                </button>
              </div>
            </section>

            {eventImages.length > 0 && (
              <section className="detail-card detail-card--content">
                <div className="detail-section-title">
                  <span className="tag">Event gallery</span>
                  <h2>Photos from this event</h2>
                </div>
                <div className="event-images-grid">
                  {eventImages.map((img, idx) => (
                    <button
                      key={img._id}
                      className="event-image-card"
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={img.caption || "Open event image"}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.caption || event.title}
                      />
                      {img.caption && (
                        <span className="event-image-caption">
                          {img.caption}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {currentImage && (
        <div
          className="lightbox"
          onClick={() => setSelectedImageIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Event image viewer"
        >
          <button
            className="lightbox-close"
            onClick={() => setSelectedImageIndex(null)}
            aria-label="Close"
          >
            ✕
          </button>

          {selectedImageIndex > 0 && (
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((i) => i - 1);
              }}
              aria-label="Previous image"
            >
              &#8249;
            </button>
          )}

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.imageUrl}
              alt={currentImage.caption || event.title}
            />
            {currentImage.caption && (
              <p className="lightbox-caption">{currentImage.caption}</p>
            )}
            <span className="lightbox-counter">
              {selectedImageIndex + 1} / {eventImages.length}
            </span>
          </div>

          {selectedImageIndex < eventImages.length - 1 && (
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((i) => i + 1);
              }}
              aria-label="Next image"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Gallery ────────────────────────────────────────────────────────────── */
export function Gallery() {
  const location = useLocation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(null); // index into images array
  const [activeEvent, setActiveEvent] = useState(
    location.state?.eventId || "all",
  );

  useEffect(() => {
    getGallery()
      .then((r) => setImages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.state?.eventId) {
      setActiveEvent(location.state.eventId);
      setLightboxIdx(null);
    } else if (!location.state) {
      setActiveEvent("all");
      setLightboxIdx(null);
    }
  }, [location.state?.eventId]);

  // Close lightbox on ESC, navigate with arrow keys
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight")
        setLightboxIdx((i) => Math.min(i + 1, filtered.length - 1));
      if (e.key === "ArrowLeft") setLightboxIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx]);

  // Build event filter tabs from linked events
  const eventTabs = [
    { id: "all", label: "All Photos" },
    ...Array.from(
      new Map(
        images
          .filter((img) => img.eventId)
          .map((img) => [
            img.eventId._id || img.eventId,
            img.eventId?.title || "Event",
          ]),
      ),
    ).map(([id, label]) => ({ id, label })),
  ];

  const filtered =
    activeEvent === "all"
      ? images
      : images.filter(
          (img) => (img.eventId?._id || img.eventId) === activeEvent,
        );

  const current = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-hero">
          <span className="tag">Photo Gallery</span>
          <h1>Our Events in Pictures</h1>
          <p>
            {location.state?.eventTitle
              ? `Showing photos from ${location.state.eventTitle}.`
              : "A look at the conferences, workshops, and team events that drive AI-Solutions forward."}
          </p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : images.length === 0 ? (
          <div className="state-box">
            <h3>No images yet</h3>
            <p>Gallery images will appear here soon.</p>
          </div>
        ) : (
          <>
            {/* Event filter tabs */}
            {eventTabs.length > 1 && (
              <div className="gallery-tabs">
                {eventTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`gallery-tab${activeEvent === tab.id ? " active" : ""}`}
                    onClick={() => {
                      setActiveEvent(tab.id);
                      setLightboxIdx(null);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            <div className="gallery-grid">
              {filtered.map((img, idx) => (
                <div
                  key={img._id}
                  className="gallery-item"
                  onClick={() => setLightboxIdx(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setLightboxIdx(idx)}
                  aria-label={img.caption || "Open image"}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption || "Gallery"}
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-zoom-icon">&#x2B</div>
                    {img.caption && <p>{img.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="lightbox"
          onClick={() => setLightboxIdx(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close */}
          <button
            className="lightbox-close"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev */}
          {lightboxIdx > 0 && (
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((i) => i - 1);
              }}
              aria-label="Previous image"
            >
              &#8249;
            </button>
          )}

          {/* Image */}
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={current.imageUrl} alt={current.caption || "Gallery"} />
            {current.caption && (
              <p className="lightbox-caption">{current.caption}</p>
            )}
            {current.eventId?.title && (
              <span className="lightbox-event">📅 {current.eventId.title}</span>
            )}
            <span className="lightbox-counter">
              {lightboxIdx + 1} / {filtered.length}
            </span>
          </div>

          {/* Next */}
          {lightboxIdx < filtered.length - 1 && (
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((i) => i + 1);
              }}
              aria-label="Next image"
            >
              &#8250;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Solutions ──────────────────────────────────────────────────────────── */
export function Solutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSolutions()
      .then((r) => setSolutions(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-hero">
          <span className="tag">What We Build</span>
          <h1>Our Solutions</h1>
          <p>
            AI-powered products designed to accelerate your team and transform
            how work gets done.
          </p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : solutions.length === 0 ? (
          <div className="state-box">
            <h3>Solutions coming soon</h3>
          </div>
        ) : (
          <div className="grid-3">
            {solutions.map((s) => (
              <div key={s._id} className="card card-hover sol-full-card">
                {s.iconOrImage && (
                  <img src={s.iconOrImage} alt={s.title} className="sol-icon" />
                )}
                <h3>{s.title}</h3>
                <p className="muted">{s.description}</p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/solutions/${s._id}`)}
                >
                  Read more
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SolutionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSolutionById(id)
      .then((r) => setSolution(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page-wrapper">
      <div className="container detail-page-shell">
        <button
          className="btn btn-outline btn-sm back-btn"
          onClick={() => navigate("/solutions")}
        >
          <ArrowLeft size={13} /> Back to Solutions
        </button>
        {loading ? (
          <div className="spinner" />
        ) : !solution ? (
          <div className="state-box">
            <h3>Solution not found.</h3>
          </div>
        ) : (
          <div className="detail-shell">
            <section className="detail-card detail-card--hero">
              <div className="detail-hero__media detail-hero__media--solution">
                {solution.iconOrImage ? (
                  <img
                    src={solution.iconOrImage}
                    alt={solution.title}
                    className="detail-hero__image"
                  />
                ) : (
                  <div className="detail-hero__fallback">SO</div>
                )}
              </div>
              <div className="detail-hero__content">
                <span className="badge badge-industry">Solution</span>
                <h1>{solution.title}</h1>
                <p className="detail-hero__subtitle">
                  Designed to help teams move faster with practical AI
                  capabilities and clear outcomes.
                </p>
                <div className="detail-hero__meta">
                  <span className="detail-pill">Tailored delivery</span>
                  <span className="detail-pill">Measurable impact</span>
                </div>
              </div>
            </section>

            <section className="detail-card detail-card--content">
              <div className="detail-section-title">
                <span className="tag">What it offers</span>
                <h2>Explore this solution</h2>
              </div>
              <div className="article-body muted">{solution.description}</div>
              <div className="detail-highlight">
                <strong>Need something similar?</strong>
                <span>
                  We can adapt this approach to your workflow, team size, and
                  goals.
                </span>
              </div>
              <div className="detail-actions">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/contact", {
                      state: { interest: solution.title },
                    })
                  }
                >
                  Request this solution
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Case Studies ───────────────────────────────────────────────────────── */
export function CaseStudies() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCaseStudies()
      .then((r) => setCases(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-hero">
          <span className="tag">Past Work</span>
          <h1>Case Studies</h1>
          <p>
            Real projects. Real challenges. Real outcomes delivered across
            industries.
          </p>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : cases.length === 0 ? (
          <div className="state-box">
            <h3>Case studies coming soon</h3>
          </div>
        ) : (
          <div className="cs-list">
            {cases.map((cs) => (
              <div key={cs._id} className="card cs-full">
                <span className="badge badge-industry">{cs.industry}</span>
                <h3>{cs.title}</h3>
                <p className="muted">{cs.summary}</p>
                {cs.outcome && (
                  <div className="cs-outcome-box">✦ {cs.outcome}</div>
                )}
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/case-studies/${cs._id}`)}
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CaseStudyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCaseStudyById(id)
      .then((r) => setCaseStudy(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page-wrapper">
      <div className="container detail-page-shell">
        <button
          className="btn btn-outline btn-sm back-btn"
          onClick={() => navigate("/case-studies")}
        >
          <ArrowLeft size={13} /> Back to Case Studies
        </button>
        {loading ? (
          <div className="spinner" />
        ) : !caseStudy ? (
          <div className="state-box">
            <h3>Case study not found.</h3>
          </div>
        ) : (
          <div className="detail-shell">
            <section className="detail-card detail-card--hero">
              <div className="detail-hero__media detail-hero__media--case">
                <div className="detail-hero__fallback">CS</div>
              </div>
              <div className="detail-hero__content">
                <span className="badge badge-industry">
                  {caseStudy.industry}
                </span>
                <h1>{caseStudy.title}</h1>
                <p className="detail-hero__subtitle">
                  A clear example of how thoughtful delivery can produce
                  measurable results.
                </p>
                <div className="detail-hero__meta">
                  <span className="detail-pill">Real-world project</span>
                  <span className="detail-pill">Outcome focused</span>
                </div>
              </div>
            </section>

            <section className="detail-card detail-card--content">
              <div className="detail-section-title">
                <span className="tag">Case study</span>
                <h2>Project overview</h2>
              </div>
              <div className="article-body muted">{caseStudy.summary}</div>
              {caseStudy.outcome && (
                <div className="detail-highlight">
                  <strong>Outcome</strong>
                  <span>{caseStudy.outcome}</span>
                </div>
              )}
              <div className="detail-actions">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/contact", {
                      state: { interest: caseStudy.title },
                    })
                  }
                >
                  Discuss similar work
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
