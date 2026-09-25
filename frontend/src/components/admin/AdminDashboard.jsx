import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  CalendarDays,
  Image,
  Star,
  Lightbulb,
  Briefcase,
  LogOut,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getEnquiries,
  deleteEnquiry,
  getAdminArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminGallery,
  uploadImage,
  deleteImage,
  updateImageData as API_updateImage,
  getAdminFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getAdminSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
  getAdminCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from "../../api";
import toast from "react-hot-toast";
import "./Admin.css";

const NAV = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  { to: "/admin/enquiries", label: "Enquiries", icon: <Inbox size={16} /> },
  { to: "/admin/articles", label: "Articles", icon: <BookOpen size={16} /> },
  { to: "/admin/events", label: "Events", icon: <CalendarDays size={16} /> },
  { to: "/admin/gallery", label: "Gallery", icon: <Image size={16} /> },
  { to: "/admin/feedback", label: "Feedback", icon: <Star size={16} /> },
  { to: "/admin/solutions", label: "Solutions", icon: <Lightbulb size={16} /> },
  {
    to: "/admin/case-studies",
    label: "Case Studies",
    icon: <Briefcase size={16} />,
  },
];

/* ─── Layout ─────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${open ? " admin-sidebar--open" : ""}`}>
        <div className="sidebar-logo">
          <Zap size={18} /> AI-Solutions
        </div>
        <p className="sidebar-user">@{admin?.username}</p>
        <nav className="sidebar-nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {icon} {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="sidebar-logout"
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <button className="topbar-burger" onClick={() => setOpen(!open)}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
          <span>Admin Panel</span>
        </div>
        <div className="admin-content">
          <Routes>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashHome />} />
            <Route path="enquiries" element={<EnquiriesPanel />} />
            <Route path="articles" element={<ArticlesPanel />} />
            <Route path="events" element={<EventsPanel />} />
            <Route path="gallery" element={<GalleryPanel />} />
            <Route path="feedback" element={<FeedbackPanel />} />
            <Route path="solutions" element={<SolutionsPanel />} />
            <Route path="case-studies" element={<CaseStudiesPanel />} />
            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard home ─────────────────────────────────────────────────────── */
function DashHome() {
  const [stats, setStats] = useState({
    enquiries: 0,
    articles: 0,
    events: 0,
    feedback: 0,
  });
  useEffect(() => {
    Promise.all([
      getEnquiries(),
      getAdminArticles(),
      getAdminEvents(),
      getAdminFeedback(),
    ])
      .then(([e, a, ev, f]) =>
        setStats({
          enquiries: e.data.total,
          articles: a.data.length,
          events: ev.data.length,
          feedback: f.data.length,
        }),
      )
      .catch(() => {});
  }, []);
  const cards = [
    {
      label: "Total Enquiries",
      val: stats.enquiries,
      icon: <Inbox size={21} />,
    },
    { label: "Articles", val: stats.articles, icon: <BookOpen size={21} /> },
    { label: "Events", val: stats.events, icon: <CalendarDays size={21} /> },
    { label: "Feedback", val: stats.feedback, icon: <Star size={21} /> },
  ];
  return (
    <div>
      <h2>Dashboard</h2>
      <p className="panel-sub">Welcome back. Here is a quick overview.</p>
      <div className="stat-grid">
        {cards.map(({ label, val, icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div>
              <div className="stat-val">{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Enquiries panel ────────────────────────────────────────────────────── */
function EnquiriesPanel() {
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnquiries()
      .then((r) => setEnquiries(r.data.enquiries))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const del = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await deleteEnquiry(id);
      setEnquiries((e) => e.filter((x) => x._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success("Enquiry deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div>
      <h2>Customer Enquiries</h2>
      <p className="panel-sub">Total: {enquiries.length} submissions</p>
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="two-col">
          <div className="list-panel">
            {enquiries.length === 0 ? (
              <p className="empty">No enquiries yet.</p>
            ) : (
              enquiries.map((e) => (
                <div
                  key={e._id}
                  className={`list-item${selected?._id === e._id ? " active" : ""}`}
                  onClick={() => setSelected(e)}
                >
                  <div className="list-item-info">
                    <strong>{e.name}</strong>
                    <span>{e.companyName}</span>
                  </div>
                  <span className="date-tag">
                    {new Date(e.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
          {selected && (
            <div className="card detail-card">
              <div className="detail-header">
                <h3>{selected.name}</h3>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => del(selected._id)}
                >
                  Delete
                </button>
              </div>
              <table className="detail-table">
                <tbody>
                  {[
                    ["Email", selected.email],
                    ["Phone", selected.phone],
                    ["Company", selected.companyName],
                    ["Country", selected.country],
                    ["Job Title", selected.jobTitle],
                    [
                      "Submitted",
                      new Date(selected.submittedAt).toLocaleString(),
                    ],
                    ["Email Sent", selected.emailSent ? "✅ Yes" : "❌ No"],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="dt-key">{k}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="job-details">
                <strong>Job Details</strong>
                <p className="muted">{selected.jobDetails}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Generic CRUD factory ───────────────────────────────────────────────── */
function CrudPanel({
  title,
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  fields,
  renderItem,
}) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | id string
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const blank = fields.reduce((a, f) => ({ ...a, [f.name]: "" }), {});

  useEffect(() => {
    fetchFn()
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openNew = () => {
    setEditing("new");
    setForm(blank);
  };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm(item);
  };
  const cancel = () => {
    setEditing(null);
    setForm({});
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === "new") {
        const res = await createFn(form);
        const key = Object.keys(res.data).find((k) => k !== "message");
        setItems((prev) => [res.data[key], ...prev]);
        toast.success("Created successfully.");
      } else {
        const res = await updateFn(editing, form);
        const key = Object.keys(res.data).find((k) => k !== "message");
        setItems((prev) =>
          prev.map((i) => (i._id === editing ? res.data[key] : i)),
        );
        toast.success("Updated successfully.");
      }
      cancel();
    } catch (err) {
      toast.error(err.response?.data?.error || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteFn(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div>
      <div className="panel-header">
        <h2>{title}</h2>
        <button className="btn btn-primary" onClick={openNew}>
          + Add New
        </button>
      </div>

      {editing && (
        <div className="card crud-form">
          <h3>
            {editing === "new"
              ? `New ${title.replace(/s$/, "")}`
              : `Edit ${title.replace(/s$/, "")}`}
          </h3>
          <div className="crud-fields">
            {fields.map((f) => (
              <div key={f.name} className="form-group">
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={form[f.name] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f.name]: e.target.value })
                    }
                    placeholder={f.placeholder}
                  />
                ) : f.type === "select" ? (
                  <select
                    value={form[f.name] || f.options[0]}
                    onChange={(e) =>
                      setForm({ ...form, [f.name]: e.target.value })
                    }
                  >
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type || "text"}
                    value={form[f.name] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f.name]: e.target.value })
                    }
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="crud-actions">
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button className="btn btn-outline" onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : items.length === 0 ? (
        <p className="empty">No {title.toLowerCase()} yet. Add one above.</p>
      ) : (
        <div className="items-list">
          {items.map((item) => (
            <div key={item._id} className="card item-row">
              <div className="item-content">{renderItem(item)}</div>
              <div className="item-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => openEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger  btn-sm"
                  onClick={() => del(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Individual panels ───────────────────────────────────────────────────── */
function ArticlesPanel() {
  return (
    <CrudPanel
      title="Articles"
      fetchFn={getAdminArticles}
      createFn={createArticle}
      updateFn={updateArticle}
      deleteFn={deleteArticle}
      fields={[
        { name: "title", label: "Title *", placeholder: "Article title" },
        {
          name: "body",
          label: "Body *",
          type: "textarea",
          placeholder: "Article content…",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["draft", "published"],
        },
      ]}
      renderItem={(a) => (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              flexWrap: "wrap",
            }}
          >
            <strong>{a.title}</strong>
            <span className={`badge badge-${a.status}`}>{a.status}</span>
          </div>
          <p
            className="muted"
            style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
          >
            {a.body?.substring(0, 100)}…
          </p>
        </>
      )}
    />
  );
}

function EventsPanel() {
  return (
    <CrudPanel
      title="Events"
      fetchFn={getAdminEvents}
      createFn={createEvent}
      updateFn={updateEvent}
      deleteFn={deleteEvent}
      fields={[
        { name: "title", label: "Title *", placeholder: "Event name" },
        {
          name: "description",
          label: "Description *",
          type: "textarea",
          placeholder: "Event details…",
        },
        { name: "eventDate", label: "Date & Time *", type: "datetime-local" },
        {
          name: "location",
          label: "Location",
          placeholder: "Sunderland, UK / Online",
        },
      ]}
      renderItem={(ev) => (
        <>
          <strong>{ev.title}</strong>
          <span className="muted date-tag" style={{ marginTop: "0.2rem" }}>
            {new Date(ev.eventDate).toLocaleString()}
          </span>
          {ev.location && (
            <span className="muted" style={{ fontSize: "0.82rem" }}>
              {ev.location}
            </span>
          )}
        </>
      )}
    />
  );
}

function GalleryPanel() {
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]); // for event dropdown
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [eventId, setEventId] = useState(""); // link image to an event
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null); // which image is being edited
  const [editData, setEditData] = useState({});

  useEffect(() => {
    Promise.all([getAdminGallery(), getAdminEvents()])
      .then(([g, e]) => {
        setImages(g.data);
        setEvents(e.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image file.");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("image", file);
    fd.append("caption", caption);
    if (eventId) fd.append("eventId", eventId);
    try {
      const res = await uploadImage(fd);
      setImages((prev) => [res.data.image, ...prev]);
      setFile(null);
      setCaption("");
      setEventId("");
      toast.success("Image uploaded successfully.");
    } catch {
      toast.error("Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((i) => i._id !== id));
      toast.success("Image deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  const saveEdit = async (id) => {
    try {
      const res = await API_updateImage(id, editData);
      setImages((prev) => prev.map((i) => (i._id === id ? res.data.image : i)));
      setEditId(null);
      setEditData({});
      toast.success("Image updated.");
    } catch {
      toast.error("Update failed.");
    }
  };

  return (
    <div>
      <h2>Gallery</h2>
      <div className="card crud-form">
        <h3>Upload New Image</h3>
        <form onSubmit={upload} className="crud-fields">
          <div className="form-group">
            <label>Image File * (max 5 MB — jpeg, png, gif, webp)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="form-group">
            <label>Caption</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Optional caption displayed under the image"
            />
          </div>
          <div className="form-group">
            <label>
              Link to Event{" "}
              <span className="muted" style={{ fontWeight: 400 }}>
                (optional — enables gallery filtering)
              </span>
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            >
              <option value="">— No event —</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ alignSelf: "flex-start" }}
          >
            {saving ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>
      {loading ? (
        <div className="spinner" />
      ) : images.length === 0 ? (
        <p className="empty" style={{ marginTop: "1rem" }}>
          No images yet. Upload one above.
        </p>
      ) : (
        <div className="gallery-admin-grid">
          {images.map((img) => (
            <div key={img._id} className="gallery-admin-item">
              <img src={img.imageUrl} alt={img.caption || ""} />
              {editId === img._id ? (
                <div className="gallery-admin-edit">
                  <input
                    value={editData.caption || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, caption: e.target.value })
                    }
                    placeholder="Caption"
                  />
                  <select
                    value={editData.eventId || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, eventId: e.target.value })
                    }
                  >
                    <option value="">— No event —</option>
                    {events.map((ev) => (
                      <option key={ev._id} value={ev._id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      marginTop: "0.4rem",
                    }}
                  >
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => saveEdit(img._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="gallery-admin-overlay">
                  <p>{img.caption || "No caption"}</p>
                  {img.eventId?.title && (
                    <span className="gallery-event-badge">
                      📅 {img.eventId.title}
                    </span>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setEditId(img._id);
                        setEditData({
                          caption: img.caption || "",
                          eventId: img.eventId?._id || "",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => del(img._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackPanel() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminFeedback()
      .then((r) => setFeedback(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setStatus = async (id, status) => {
    try {
      const res = await updateFeedbackStatus(id, status);
      setFeedback((prev) =>
        prev.map((f) => (f._id === id ? res.data.feedback : f)),
      );
      toast.success(`Feedback ${status}.`);
    } catch {
      toast.error("Update failed.");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await deleteFeedback(id);
      setFeedback((prev) => prev.filter((f) => f._id !== id));
      toast.success("Deleted.");
    } catch {
      toast.error("Failed.");
    }
  };

  return (
    <div>
      <h2>Customer Feedback</h2>
      {loading ? (
        <div className="spinner" />
      ) : feedback.length === 0 ? (
        <p className="empty">No feedback yet.</p>
      ) : (
        <div className="items-list">
          {feedback.map((f) => (
            <div key={f._id} className="card item-row">
              <div className="item-content">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    flexWrap: "wrap",
                  }}
                >
                  <strong>{f.customerName}</strong>
                  {f.companyName && (
                    <span className="muted" style={{ fontSize: "0.82rem" }}>
                      {f.companyName}
                    </span>
                  )}
                  <span className={`badge badge-${f.status}`}>{f.status}</span>
                  <span style={{ color: "var(--cyan)", fontSize: "0.82rem" }}>
                    {"★".repeat(f.rating)}
                  </span>
                </div>
                <p
                  className="muted"
                  style={{ fontSize: "0.875rem", marginTop: "0.3rem" }}
                >
                  {f.comment}
                </p>
              </div>
              <div className="item-actions">
                {f.status !== "approved" && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setStatus(f._id, "approved")}
                  >
                    Approve
                  </button>
                )}
                {f.status !== "hidden" && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setStatus(f._id, "hidden")}
                  >
                    Hide
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => del(f._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SolutionsPanel() {
  return (
    <CrudPanel
      title="Solutions"
      fetchFn={getAdminSolutions}
      createFn={createSolution}
      updateFn={updateSolution}
      deleteFn={deleteSolution}
      fields={[
        { name: "title", label: "Title *", placeholder: "Solution name" },
        {
          name: "description",
          label: "Description *",
          type: "textarea",
          placeholder: "Describe the solution…",
        },
        {
          name: "iconOrImage",
          label: "Icon/Image URL",
          placeholder: "https://…",
        },
      ]}
      renderItem={(s) => (
        <>
          <strong>{s.title}</strong>
          <p
            className="muted"
            style={{ fontSize: "0.875rem", marginTop: "0.2rem" }}
          >
            {s.description?.substring(0, 100)}…
          </p>
        </>
      )}
    />
  );
}

function CaseStudiesPanel() {
  return (
    <CrudPanel
      title="Case Studies"
      fetchFn={getAdminCaseStudies}
      createFn={createCaseStudy}
      updateFn={updateCaseStudy}
      deleteFn={deleteCaseStudy}
      fields={[
        { name: "title", label: "Title *", placeholder: "Project title" },
        {
          name: "industry",
          label: "Industry *",
          placeholder: "Healthcare, Manufacturing…",
        },
        {
          name: "summary",
          label: "Summary *",
          type: "textarea",
          placeholder: "Describe the challenge and solution…",
        },
        {
          name: "outcome",
          label: "Outcome",
          placeholder: "e.g. Reduced response times by 40%",
        },
      ]}
      renderItem={(cs) => (
        <>
          <span className="badge badge-industry">{cs.industry}</span>
          <strong style={{ display: "block", marginTop: "0.35rem" }}>
            {cs.title}
          </strong>
          <p
            className="muted"
            style={{ fontSize: "0.875rem", marginTop: "0.2rem" }}
          >
            {cs.summary?.substring(0, 100)}…
          </p>
          {cs.outcome && (
            <p
              style={{
                color: "var(--cyan)",
                fontSize: "0.82rem",
                marginTop: "0.2rem",
              }}
            >
              ✦ {cs.outcome}
            </p>
          )}
        </>
      )}
    />
  );
}
