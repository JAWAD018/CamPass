import { signInWithPopup, auth, provider } from "../auth/config";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <div className="border rounded-xl px-10 py-25 flex flex-col shadow-2xl border-gray-100 "> 
      <h1 className="text-2xl font-semibold p-5 ">Login to Continue</h1>
      <button
        onClick={handleLogin}
        className="bg-primary text-white font-semibold px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
      </div>
    </div>
  );
}
