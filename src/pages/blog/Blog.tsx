import './Blog.css'

interface BlogPost {
  id: string
  title: string
  date: string
  excerpt: string
  content: string[]
}

const posts: BlogPost[] = [
  {
    id: "ilk-yazi",
    title: "Morstilia Projesi Başladı",
    date: "11 Nisan 2026",
    excerpt: "Python ile yazılmış açık kaynak satranç motoru projemizin ilk adımları.",
    content: [
      "",
      "Bütün projelerimiz açık kaynak olarak GitHub'da yayınlanmıştır."
    ]
  },
  // Yeni blog yazılarını buraya ekleyebilirsiniz:
  // {
  //   id: "yeni-yazi",
  //   title: "Yazı Başlığı",
  //   date: "12 Nisan 2026",
  //   excerpt: "Kısa açıklama.",
  //   content: [
  //     "Paragraf 1",
  //     "Paragraf 2"
  //   ]
  // }
]

function Blog() {
  return (
    <section className="blog-section">
      <div className="blog-header">
        <h1>Blog</h1>
        <p>Morstilia projesi hakkında güncellemeler ve duyurular.</p>
      </div>

      <div className="blog-grid">
        {posts.map(post => (
          <article key={post.id} className="blog-card">
            <div className="blog-card-header">
              <h2>{post.title}</h2>
              <span className="blog-date">{post.date}</span>
            </div>

            <p className="blog-excerpt">{post.excerpt}</p>

            <div className="blog-content-text">
              {post.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Blog
