import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { ApiError } from '../../lib/api'

const confirmSchema = z.object({
  token: z.string().length(6, 'El token debe tener 6 caracteres'),
})

const resendSchema = z.object({
  email: z.string().email('Correo no válido'),
})

type ConfirmData = z.infer<typeof confirmSchema>
type ResendData = z.infer<typeof resendSchema>

export default function ConfirmAccountPage() {
  const navigate = useNavigate()

  const confirmForm = useForm<ConfirmData>({ resolver: zodResolver(confirmSchema) })
  const resendForm = useForm<ResendData>({ resolver: zodResolver(resendSchema) })

  const confirmMutation = useMutation({
    mutationFn: (data: ConfirmData) => authApi.confirmAccount(data.token),
    onSuccess: () => navigate('/auth/login'),
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'Token inválido'
      confirmForm.setError('root', { message })
    },
  })

  const resendMutation = useMutation({
    mutationFn: (data: ResendData) => authApi.requestCode(data.email),
    onSuccess: () => resendForm.setError('root', { message: 'Código reenviado al correo' }),
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'No se pudo reenviar el código'
      resendForm.setError('root', { message })
    },
  })

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 m-0 mb-1">Confirmar cuenta</h2>
      <p className="text-sm text-slate-500 m-0 mb-6">
        Ingresa el código de 6 dígitos que enviamos a tu correo
      </p>

      <form
        onSubmit={confirmForm.handleSubmit((data) => confirmMutation.mutate(data))}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Código</label>
          <input
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500 tracking-widest text-center font-mono"
            maxLength={6}
            {...confirmForm.register('token')}
          />
          {confirmForm.formState.errors.token && (
            <p className="text-xs text-red-600 mt-1">{confirmForm.formState.errors.token.message}</p>
          )}
        </div>

        {confirmForm.formState.errors.root && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {confirmForm.formState.errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={confirmMutation.isPending}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-xl py-2.5 text-sm cursor-pointer disabled:opacity-60"
        >
          {confirmMutation.isPending ? 'Confirmando…' : 'Confirmar cuenta'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-500 mb-3">¿No recibiste el código?</p>
        <form
          onSubmit={resendForm.handleSubmit((data) => resendMutation.mutate(data))}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            placeholder="tu@correo.com"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
            {...resendForm.register('email')}
          />
          {resendForm.formState.errors.email && (
            <p className="text-xs text-red-600">{resendForm.formState.errors.email.message}</p>
          )}
          {resendForm.formState.errors.root && (
            <p className="text-xs text-slate-700">{resendForm.formState.errors.root.message}</p>
          )}
          <button
            type="submit"
            disabled={resendMutation.isPending}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl py-2 text-sm cursor-pointer disabled:opacity-60"
          >
            {resendMutation.isPending ? 'Enviando…' : 'Reenviar código'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-center">
        <Link to="/auth/login" className="text-cyan-700 hover:underline">
          Volver al login
        </Link>
      </p>
    </div>
  )
}
