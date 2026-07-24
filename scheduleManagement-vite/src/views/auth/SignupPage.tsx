import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { ApiError } from '../../lib/api'

const schema = z
  .object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    email: z.email('Correo no válido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    password_confirmation: z.string().min(8, 'Mínimo 8 caracteres'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (data: FormData) => authApi.createAccount(data),
    onSuccess: () => navigate('/auth/confirm_account'),
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'No se pudo crear la cuenta'
      setError('root', { message })
    },
  })

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 m-0 mb-1">Crear cuenta</h2>
      <p className="text-sm text-slate-500 m-0 mb-6">Regístrate para solicitar espacios y eventos</p>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre</label>
          <input
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>

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

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirmar contraseña</label>
          <input
            type="password"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
            {...register('password_confirmation')}
          />
          {errors.password_confirmation && (
            <p className="text-xs text-red-600 mt-1">{errors.password_confirmation.message}</p>
          )}
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
          {mutation.isPending ? 'Creando…' : 'Registrarse'}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/auth/login" className="text-cyan-700 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
