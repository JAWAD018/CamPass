import { useState } from "react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div className="bg-[#F9FAFB] w-full h-14 flex justify-between px-4 md:px-24 items-center">
        <div className="text-2xl font-bold text-[#221E1E]"><a href="/">Campass</a></div>

        {/* Desktop Menu */}
        <ul className="md:flex hidden font-semibold text-[#221E1E]">
          <li className="mx-[10px] cursor-pointer">
            <a href="/">Home</a>
          </li>
          <li className="mx-[10px] cursor-pointer">
            <a href="/about">About</a>
          </li>
          <li className="mx-[10px] cursor-pointer">
            <a href="/contact">Contact Us</a>
          </li>
        </ul>

        {/* Desktop Login Button */}
        <div className="hidden md:block font-semibold text-[#F9FAFB] bg-[#7C3AED] p-1 px-3 rounded-lg cursor-pointer">
          <a href="/login">Login</a>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-3xl text-[#221E1E]">
            &#8801;
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F9FAFB] px-4 py-2 space-y-2 font-semibold text-[#221E1E]">
          <a href="/" className="block  py-1  ">Home</a>
          <a href="/about" className="block py-1  ">About</a>
          <a href="contact" className="block py-1  ">Contact Us</a>
          <a href="/login" className="block bg-[#7C3AED] text-white px-3 py-1 rounded-lg w-fit">Login</a>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
