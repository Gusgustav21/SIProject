import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link to="/auth/login" className="no-underline inline-flex items-center gap-3">
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 p-2.5 rounded-xl text-2xl">
            🎓
          </div>
          <div className="text-left">
            <h1 className="text-slate-900 text-xl font-bold m-0">FaCyT Event Manager</h1>
            <p className="text-slate-500 text-xs m-0">Universidad de Carabobo</p>
          </div>
        </Link>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <Outlet />
      </div>
    </div>
  )
}
