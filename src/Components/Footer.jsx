function Footer() {
  return (
    <footer className="bg-gray-900 text-white md:h-30 py-8 px-6 md:px-24 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Left - Brand Info */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h3 className="text-xl font-bold">Campass</h3>
          <p className="text-sm text-gray-400">Empowering campus experiences</p>
        </div>

        {/* Middle - Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#HowTo" className="text-gray-300 hover:text-white text-sm">How It Works</a>
          <a href="#features" className="text-gray-300 hover:text-white text-sm">Features</a>
          <a href="#contact" className="text-gray-300 hover:text-white text-sm">Contact</a>
        </div>

        {/* Right - Contact Info */}
        <div className="text-center md:text-right text-sm text-gray-400">
          <p>Email: support@campass.app</p>
          <p>© {new Date().getFullYear()} Campass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
