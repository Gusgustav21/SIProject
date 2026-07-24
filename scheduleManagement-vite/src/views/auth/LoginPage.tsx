import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../stores/useAuthStore'
import { ApiError } from '../../lib/api'

const schema = z.object({
  email: z.email('Correo no válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const token = await authApi.login(data)
      const user = await authApi.getUser(token)
      return { token, user }
    },
    onSuccess: ({ token, user }) => {
      setSession(token, user)
      navigate('/', { replace: true })
    },
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'No se pudo iniciar sesión'
      setError('root', { message })
    },
  })

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 m-0 mb-1">Iniciar sesión</h2>
      <p className="text-sm text-slate-500 m-0 mb-6">Accede a la plataforma de gestión de eventos</p>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Correo</label>
          <input
            type="email"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contraseña</label>
          <input
            type="password"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
            {...register('password')}
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>

        {errors.root && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-xl py-2.5 text-sm cursor-pointer disabled:opacity-60"
        >
          {mutation.isPending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 text-sm text-center">
        <Link to="/auth/forgot_password" className="text-cyan-700 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link to="/auth/signup" className="text-slate-600 hover:underline">
          Crear cuenta
        </Link>
      </div>
    </div>
  )
}
