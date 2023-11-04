//import { Outlet } from "react-router"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="p-8 w-screen h-screen bg-white text-neutral-700 flex flex-col gap-2 text-xl">
      <div className="text-4xl font-bold mb-4">
        Landing Page
      </div>
      <Link to="/" className="hover:text-blue-600">Navigate: INDEX</Link>
      <Link to="/login" className="hover:text-blue-600">Navigate: LOGIN</Link>
      <Link to="/dashboard" className="hover:text-blue-600">Navigate: DASHBOARD</Link>
      <Link to="/play" className="hover:text-blue-600">Navigate: PLAY</Link>
    </div> 
  )
}
 