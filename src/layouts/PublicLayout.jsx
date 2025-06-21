import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
