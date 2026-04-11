import './Engines.css'

interface EngineInfo {
  id: string
  name: string
  description: string
  language: string
  version: string
  elo?: string
  githubLink?: string
  downloadLink?: string
}

const engines: EngineInfo[] = [
  {
    id: "morstilia",
    name: "Morstilia",
    description: "My first chess engine.",
    language: "Python",
    version: "v5",
    elo: "1400",
    githubLink: "https://github.com/ALPDM447/MorstiliaChessEngine",
    downloadLink: "https://github.com/ALPDM447/MorstiliaChessEngine/releases"
  },
  // Yeni satranç motorlarını aşağıya ekleyebilirsiniz:
  // {
  //   id: "yeni-motor",
  //   name: "Yeni Motor Adı",
  //   description: "Motorunuzun açıklaması.",
  //   language: "C++",
  //   version: "v0.1",
  //   elo: "1200",
  //   githubLink: "https://github.com/...",
  //   downloadLink: "https://github.com/..."
  // }
]

function Engines() {
  return (
    <section className="engines-section">
      <div className="engines-header">
        <h1>Chess Engines</h1>
        <p>Geliştirdiğim tüm satranç motorları ve projeleri.</p>
      </div>
      
      <div className="engines-grid">
        {engines.map(engine => (
          <div key={engine.id} className="engine-card">
            <div className="engine-card-header">
              <h2>{engine.name}</h2>
              {engine.version && <span className="engine-version">{engine.version}</span>}
            </div>
            
            <p className="engine-desc">{engine.description}</p>
            
            <div className="engine-meta">
              <span className="engine-lang">
                <span className="meta-icon">💻</span> {engine.language}
              </span>
              {engine.elo && (
                <span className="engine-elo">
                  <span className="meta-icon">🏆</span> Elo: {engine.elo}
                </span>
              )}
            </div>

            <div className="engine-actions">
              {engine.githubLink && (
                <a 
                  href={engine.githubLink} 
                  className="engine-btn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              )}
              {engine.downloadLink && (
                <a 
                  href={engine.downloadLink} 
                  className="engine-btn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Engines
