import '../../App.css'

function About() {
  return (
    <section className="about-section">
      <h1>About Morstilia</h1>
      <div className="about-content">
        <p>
          Morstilia is a powerful open-source chess engine written in Python. 
          It is designed for developers and chess enthusiasts who want to explore 
          the world of computer chess and game development.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Advanced move generation and evaluation</li>
          <li>Minimax algorithm with alpha-beta pruning</li>
          <li>UCI protocol support for integration with GUIs</li>
          <li>Extensible architecture for customization</li>
        </ul>
        <h2>Get Involved</h2>
        <p>
          Morstilia is an open-source project. Contributions are welcome! 
          Visit our GitHub repository to report issues, suggest features, or 
          contribute code.
        </p>
      </div>
    </section>
  )
}

export default About
