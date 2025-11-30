import { useEffect, useState } from "react";
import "./App.css";

type Version = {
  id: string;
  timestamp: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
  content?: string;
};

const API_BASE = "http://localhost:4000";

function App() {
  const [content, setContent] = useState("");
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing versions on first render
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await fetch(`${API_BASE}/versions`);
        const data = await res.json();
        setVersions(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load versions");
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  const handleSaveVersion = async () => {
    if (!content.trim()) {
      alert("Please enter some content before saving a version.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/save-version`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("Failed to save version");
      }

      const data = await res.json();
      // backend returns { success, version, versions }
      setVersions(data.versions || []);
    } catch (err) {
      console.error(err);
      setError("Failed to save version");
    } finally {
      setSaving(false);
    }
  };

  const formatTimestamp = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString();
  };

  //Revert to a version's content
  const handleRevert = (version: Version) => {
    if (!version.content) {
      alert("No content stored for this version.");
      return;
    }
    setContent(version.content);
  };

  //Download JSON report of all versions
  const handleDownloadReport = () => {
    if (!versions.length) return;

    const blob = new Blob([JSON.stringify(versions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "version-history.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mini Audit Trail Generator</h1>
        <p className="subtitle">
          Type content, save versions, and track what changed over time.
        </p>
      </header>

      <main className="app-main">
    
        <section className="editor-section">
          <h2>Content Editor</h2>
          <textarea
            className="editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type or paste your content here..."
          />
          <button
            className="save-button"
            onClick={handleSaveVersion}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Version"}
          </button>
          <p className="hint">
            Every time you click &quot;Save Version&quot;, a new entry will be
            added to the version history with added/removed words.
          </p>
        </section>

        <section className="history-section">
          <div className="history-header">
            <h2>Version History</h2>

            <button
              className="download-button"
              onClick={handleDownloadReport}
              disabled={!versions.length}
            >
              Download JSON Report
            </button>
          </div>

          {loading && <p>Loading versions...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && versions.length === 0 && !error && (
            <p className="empty-state">No versions saved yet.</p>
          )}

          <div className="versions-list">
            {versions.map((v, index) => (
              <div key={v.id} className="version-card">
                <div className="version-header">
                  <span className="version-title">Version {index + 1}</span>
                  <span className="version-timestamp">
                    {formatTimestamp(v.timestamp)}
                  </span>
                </div>

                <div className="version-row">
                  <span className="label">Old length:</span>
                  <span>{v.oldLength} words</span>
                </div>
                <div className="version-row">
                  <span className="label">New length:</span>
                  <span>{v.newLength} words</span>
                </div>

                <div className="version-row">
                  <span className="label">Added words:</span>
                  <span className="chips">
                    {v.addedWords.length > 0 ? (
                      <span className="chips-container">
                        {v.addedWords.map((w, i) => (
                          <span key={i} className="chip chip-added">
                            {w}
                          </span>
                        ))}
                      </span>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>

                <div className="version-row">
                  <span className="label">Removed words:</span>
                  <span className="chips">
                    {v.removedWords.length > 0 ? (
                      <span className="chips-container">
                        {v.removedWords.map((w, i) => (
                          <span key={i} className="chip chip-removed">
                            {w}
                          </span>
                        ))}
                      </span>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>

                <div className="version-actions">
                  <button
                    className="revert-button"
                    onClick={() => handleRevert(v)}
                  >
                    Revert to this version
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
