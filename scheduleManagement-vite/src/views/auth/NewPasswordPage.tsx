import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { authApi } from '../../api/auth'
import { ApiError } from '../../lib/api'

const tokenSchema = z.object({
  token: z.string().length(6, 'El token debe tener 6 caracteres'),
})

const passwordSchema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    password_confirmation: z.string().min(8, 'Mínimo 8 caracteres'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

type TokenData = z.infer<typeof tokenSchema>
type PasswordData = z.infer<typeof passwordSchema>

export default function NewPasswordPage() {
  const navigate = useNavigate()
  const [validatedToken, setValidatedToken] = useState<string | null>(null)

  const tokenForm = useForm<TokenData>({ resolver: zodResolver(tokenSchema) })
  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) })

  const validateMutation = useMutation({
    mutationFn: (data: TokenData) => authApi.validateToken(data.token),
    onSuccess: (_res, variables) => setValidatedToken(variables.token),
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'Token inválido'
      tokenForm.setError('root', { message })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: PasswordData) =>
      authApi.updatePassword(validatedToken!, data.password, data.password_confirmation),
    onSuccess: () => navigate('/auth/login'),
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'No se pudo actualizar la contraseña'
      passwordForm.setError('root', { message })
    },
  })

  if (!validatedToken) {
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-900 m-0 mb-1">Restablecer contraseña</h2>
        <p className="text-sm text-slate-500 m-0 mb-6">Paso 1: valida el código del correo</p>

        <form
          onSubmit={tokenForm.handleSubmit((data) => validateMutation.mutate(data))}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Código</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500 tracking-widest text-center font-mono"
              maxLength={6}
              {...tokenForm.register('token')}
            />
            {tokenForm.formState.errors.token && (
              <p className="text-xs text-red-600 mt-1">{tokenForm.formState.errors.token.message}</p>
            )}
          </div>

          {tokenForm.formState.errors.root && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {tokenForm.formState.errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={validateMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-xl py-2.5 text-sm cursor-pointer disabled:opacity-60"
          >
            {validateMutation.isPending ? 'Validando…' : 'Validar código'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          <Link to="/auth/forgot_password" className="text-cyan-700 hover:underline">
            Solicitar otro código
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 m-0 mb-1">Nueva contraseña</h2>
      <p className="text-sm text-slate-500 m-0 mb-6">Paso 2: elige tu nueva contraseña</p>

      <form
        onSubmit={passwordForm.handleSubmit((data) => updateMutation.mutate(data))}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Contraseña</label>
          <input
            type="password"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
            {...passwordForm.register('password')}
          />
          {passwordForm.formState.errors.password && (
            <p className="text-xs text-red-600 mt-1">{passwordForm.formState.errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirmar</label>
          <input
            type="password"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500"
            {...passwordForm.register('password_confirmation')}
          />
          {passwordForm.formState.errors.password_confirmation && (
            <p className="text-xs text-red-600 mt-1">
              {passwordForm.formState.errors.password_confirmation.message}
            </p>
          )}
        </div>

        {passwordForm.formState.errors.root && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {passwordForm.formState.errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-xl py-2.5 text-sm cursor-pointer disabled:opacity-60"
        >
          {updateMutation.isPending ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
    </div>
  )
}
