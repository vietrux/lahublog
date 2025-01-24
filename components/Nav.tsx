export default function NavBar() {
    return (
      <nav className="fixed w-full top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a 
                href="/" 
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent"
              >
                LaHu Blog
              </a>
            </div>
  
          </div>
        </div>
      </nav>
    );
  }
  