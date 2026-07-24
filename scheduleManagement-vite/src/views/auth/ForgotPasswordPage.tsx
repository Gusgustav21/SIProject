import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { ApiError } from '../../lib/api'
import { useState } from 'react'

const schema = z.object({
  email: z.email('Correo no válido'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: (data: FormData) => authApi.forgotPassword(data.email),
    onSuccess: () => setSuccess(true),
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'No se pudo enviar el correo'
      setError('root', { message })
    },
  })

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 m-0 mb-1">Olvidé mi contraseña</h2>
      <p className="text-sm text-slate-500 m-0 mb-6">
        Te enviaremos un código para restablecer tu contraseña
      </p>

      {success ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            Revisa tu correo para continuar con el restablecimiento.
          </p>
          <Link
            to="/auth/new_password"
            className="w-full text-center bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-xl py-2.5 text-sm no-underline"
          >
            Ingresar código
          </Link>
        </div>
      ) : (
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
            {mutation.isPending ? 'Enviando…' : 'Enviar código'}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-center">
        <Link to="/auth/login" className="text-cyan-700 hover:underline">
          Volver al login
        </Link>
      </p>
    </div>
  )
}
