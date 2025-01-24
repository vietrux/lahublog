export default function Footer() {
    return (
        <footer className="bg-white/5 backdrop-blur-lg border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white/80 text-sm">
              © {new Date().getFullYear()} LaHu. Crafted with 
              <span className="text-pink-400 mx-1.5">♥</span>
            </p>
          </div>
        </div>
      </footer>
      );
    }