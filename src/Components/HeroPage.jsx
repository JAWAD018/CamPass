import heroImg from '../assets/heroImg.svg'
import signUp from '../assets/signUp.svg'
import create from '../assets/create.svg'
import qr from '../assets/qr.svg'
import qrsend from '../assets/qr-send.svg'
import thinking from '../assets/thinking.svg'
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
function HeroPage() {

  const navigate = useNavigate()

  
  return (
    <>   
      <section className="flex flex-col md:flex-row items-center justify-evenly px-6 md:px-24 py-12 ">
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold mb-4 " id='welcome'>Welcome to <span className='text-[#7C3AED]'>Campass</span></h1>
        <p className="text-lg text-gray-600 mb-6">
          Empower your campus journey with our all-in-one platform.
        </p>
        <button 
        onClick={()=>navigate('/login')}
        className="bg-[#7C3AED] text-white px-6 py-2 rounded-lg font-semibold">
          Get Started
        </button>
      </div>
      <img src={heroImg} alt="Hero" id="heroImg" className="w-full max-w-md mt-10 md:mt-0" />
    </section>
    {/* How to use */}

  <section id="HowTo" className="py-12 px-6 md:px-24 bg-[#F9FAFB]">
  <h2 className="text-3xl font-bold text-center mb-12">How to Use Campass</h2>

  <div className="grid md:grid-cols-4 gap-8 text-center">
    {/* Step 1 */}
    <div className="flex flex-col items-center">
      <img src={signUp} alt="Sign Up" className="w-30 h-30 mb-4" />
      <h3 className="text-xl font-semibold mb-2">1. College Sign Up</h3>
      <p className="text-gray-600 text-sm">Colleges register with their details and get access to their event dashboard.</p>
    </div>

    {/* Step 2 */}
    <div className="flex flex-col items-center">
      <img src={create} alt="Create Event" className="w-30 h-30 mb-4" />
      <h3 className="text-xl font-semibold mb-2">2. Create Event</h3>
      <p className="text-gray-600 text-sm">Admins can create events and upload a verified student list (with roll numbers).</p>
    </div>

    {/* Step 3 */}
    <div className="flex flex-col items-center">
      <img src={qr} alt="Send QR" className="w-30 h-30 mb-4" />
      <h3 className="text-xl font-semibold mb-2">3. QR Sent to Students</h3>
      <p className="text-gray-600 text-sm">Personalized QR codes are auto-generated and sent to each verified student.</p>
    </div>

    {/* Step 4 */}
    <div className="flex flex-col items-center">
      <img src={qrsend} alt="Check In" className="w-30 h-30 mb-4" />
      <h3 className="text-xl font-semibold mb-2">4. QR Check-in</h3>
      <p className="text-gray-600 text-sm">At the event, students check in with QR codes. Identity is verified instantly.</p>
    </div>
  </div>
</section>


    {/* Why Campass? */}
  <section className="py-12 px-6 md:px-24" >
  <h2 className="text-3xl font-bold text-center mb-8">Why Campass is Important</h2>
  <div className="grid md:grid-cols-2 gap-8 items-center">
    <img src={thinking} alt="Secure Check-In" className="w-full max-w-md mx-auto" />

    <ul className="space-y-4 text-lg text-gray-700">
      <li className="flex items-start">
        <CheckCircle className="text-[#7C3AED] w-6 h-6 mr-2 mt-1" />
        Ensures onlyverified students attend college events.
      </li>
      <li className="flex items-start">
        <CheckCircle className="text-[#7C3AED] w-6 h-6 mr-2 mt-1" />
        Automates QR-based check-ins to prevent fake entries.
      </li>
      <li className="flex items-start">
        <CheckCircle className="text-[#7C3AED] w-6 h-6 mr-2 mt-1" />
        Displaysstudent details (name, photo, roll no.) at the gate for validation.
      </li>
      <li className="flex items-start">
        <CheckCircle className="text-[#7C3AED] w-6 h-6 mr-2 mt-1" />
        Maintains a secure digital attendance log in real-time.
      </li>
      <li className="flex items-start">
        <CheckCircle className="text-[#7C3AED] w-6 h-6 mr-2 mt-1" />
        Saves time, removes manual errors, and improves transparency & trust.
      </li>
    </ul>
  </div>
</section>

    </>
  )
}

export default HeroPage
