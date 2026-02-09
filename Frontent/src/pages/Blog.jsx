import React, { useState } from 'react';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'tutorial', name: 'Tutorials' },
    { id: 'research', name: 'Research' },
    { id: 'news', name: 'News' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const blogs = [
    {
      id: 1,
      title: 'Introduction to Quantum Computing',
      excerpt: 'Learn the basics of quantum computing and how it differs from classical computing.',
      category: 'beginner',
      author: 'Dr. Alice Quantum',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"%3E%3Crect fill="%236366f1" width="800" height="400"/%3E%3Ccircle fill="%238b5cf6" cx="200" cy="200" r="100"/%3E%3Ccircle fill="%23ec4899" cx="600" cy="200" r="80"/%3E%3Ctext x="400" y="200" font-family="Arial" font-size="36" fill="white" text-anchor="middle" dy=".3em"%3EQuantum Computing%3C/text%3E%3C/svg%3E'
    },
    {
      id: 2,
      title: 'Building Your First Quantum Circuit',
      excerpt: 'A step-by-step guide to creating and simulating your first quantum circuit.',
      category: 'tutorial',
      author: 'Bob Developer',
      date: '2024-01-20',
      readTime: '8 min read',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"%3E%3Crect fill="%231e1b4b" width="800" height="400"/%3E%3Cpath fill="%236366f1" d="M100 150 L700 150 L700 250 L100 250 Z"/%3E%3Ccircle fill="%238b5cf6" cx="200" cy="200" r="30"/%3E%3Ccircle fill="%23ec4899" cx="350" cy="200" r="30"/%3E%3Ccircle fill="%238b5cf6" cx="500" cy="200" r="30"/%3E%3Ccircle fill="%23ec4899" cx="650" cy="200" r="30"/%3E%3Ctext x="400" y="350" font-family="Arial" font-size="28" fill="white" text-anchor="middle"%3EQuantum Circuit%3C/text%3E%3C/svg%3E'
    },
    {
      id: 3,
      title: 'Quantum Entanglement Explained',
      excerpt: 'Understanding one of the most fascinating phenomena in quantum mechanics.',
      category: 'research',
      author: 'Dr. Alice Quantum',
      date: '2024-01-25',
      readTime: '6 min read',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"%3E%3Crect fill="%230f172a" width="800" height="400"/%3E%3Ccircle fill="%238b5cf6" cx="300" cy="200" r="80" opacity="0.6"/%3E%3Ccircle fill="%23ec4899" cx="500" cy="200" r="80" opacity="0.6"/%3E%3Cline stroke="%236366f1" stroke-width="4" x1="380" y1="200" x2="420" y2="200"/%3E%3Ctext x="400" y="320" font-family="Arial" font-size="32" fill="white" text-anchor="middle"%3EQuantum Entanglement%3C/text%3E%3C/svg%3E'
    },
    {
      id: 4,
      title: 'Quantum Computing in 2024',
      excerpt: 'Latest trends and developments in the field of quantum computing.',
      category: 'news',
      author: 'Charlie Designer',
      date: '2024-01-30',
      readTime: '4 min read',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"%3E%3Crect fill="%231e1b4b" width="800" height="400"/%3E%3Cpath fill="%236366f1" d="M100 100 L700 100 L700 300 L100 300 Z"/%3E%3Ccircle fill="%238b5cf6" cx="200" cy="200" r="50"/%3E%3Ccircle fill="%23ec4899" cx="400" cy="200" r="50"/%3E%3Ccircle fill="%238b5cf6" cx="600" cy="200" r="50"/%3E%3Ctext x="400" y="350" font-family="Arial" font-size="30" fill="white" text-anchor="middle"%3E2024 Quantum Trends%3C/text%3E%3C/svg%3E'
    },
    {
      id: 5,
      title: 'Grover\'s Algorithm Explained',
      excerpt: 'Learn about quantum search algorithms and how Grover\'s algorithm works.',
      category: 'advanced',
      author: 'Dr. Alice Quantum',
      date: '2024-02-05',
      readTime: '10 min read',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect fill='%230f172a' width='800' height='400'/%3E%3Cpath fill='%238b5cf6' d='M200 100 L600 100 L600 300 L200 300 Z'/%3E%3Ccircle fill='%23ec4899' cx='300' cy='200' r='60'/%3E%3Ccircle fill='%236366f1' cx='500' cy='200' r='60'/%3E%3Ctext x='400' y='350' font-family='Arial' font-size='32' fill='white' text-anchor='middle'%3EGrover's Algorithm%3C/text%3E%3C/svg%3E"
    },
    {
      id: 6,
      title: 'Quantum Machine Learning Basics',
      excerpt: 'Introduction to the intersection of quantum computing and machine learning.',
      category: 'tutorial',
      author: 'Bob Developer',
      date: '2024-02-10',
      readTime: '7 min read',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"%3E%3Crect fill="%231e1b4b" width="800" height="400"/%3E%3Cpath fill="%236366f1" d="M150 150 L650 150 L650 250 L150 250 Z"/%3E%3Ccircle fill="%23ec4899" cx="250" cy="200" r="40"/%3E%3Ccircle fill="%238b5cf6" cx="400" cy="200" r="40"/%3E%3Ccircle fill="%23ec4899" cx="550" cy="200" r="40"/%3E%3Ctext x="400" y="350" font-family="Arial" font-size="28" fill="white" text-anchor="middle"%3EQuantum ML%3C/text%3E%3C/svg%3E'
    }
  ];

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
              <span className="text-sm font-semibold text-purple-300">Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Quantum Computing Blog
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest news, tutorials, and research in the world of quantum computing.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div 
                key={blog.id} 
                className="bg-slate-700/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-600 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <span className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {blog.author}
                    </span>
                    <span className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {blog.date}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {blog.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-300 group-hover:text-purple-200 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <a 
                    href={`/blog/${blog.id}`} 
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    Read more
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-700/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M12 20h.01M15 20h.01m-9-16h.01m4 0h.01m4 0h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-300">No articles found</h3>
              <p className="text-gray-400">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-white/80 mb-10">Subscribe to our newsletter for the latest quantum computing news and tutorials</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
            <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-white/30">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;