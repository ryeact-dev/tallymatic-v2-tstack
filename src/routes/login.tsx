import { createFileRoute, redirect } from '@tanstack/react-router'
import { Button, Card, CardBody, CardHeader, Form, Input } from '@heroui/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { EyeIcon, EyeOffIcon, KeyIcon, UserIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { LoginFormValues } from '~/zod/form.schema'
import { loginSchema } from '~/zod/form.schema'
import { useLoginUserMutation } from '~/hooks/auth.hook'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    const user = context.user

    if (user) {
      throw redirect({ to: '/', replace: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const { mutate: loginUserMutate, isPending } = useLoginUserMutation()

  // Initialize react-hook-form with zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    loginUserMutate(data)
  }

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex justify-center items-center pt-10"
    >
      <Card className="border border-divider shadow-lg w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center pb-0">
          {/* <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Icon icon="lucide:lock" className="text-primary text-xl" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-sm text-foreground-500">Sign in to continue to your account</p> */}
        </CardHeader>
        <CardBody className="px-6 py-5">
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Username"
                  placeholder="Enter your username"
                  startContent={
                    <UserIcon className="text-default-400 text-lg" />
                  }
                  isRequired
                  isInvalid={!!errors.username}
                  errorMessage={errors.username?.message}
                  classNames={{
                    input: 'pl-1',
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Password"
                  placeholder="Enter your password"
                  type={isVisible ? 'text' : 'password'}
                  startContent={
                    <KeyIcon className="text-default-400 text-lg" />
                  }
                  endContent={
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="focus:outline-none"
                    >
                      {isVisible ? (
                        <EyeIcon className="text-default-400 text-lg cursor-pointer" />
                      ) : (
                        <EyeOffIcon className="text-default-400 text-lg cursor-pointer" />
                      )}
                    </button>
                  }
                  isRequired
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  classNames={{
                    input: 'pl-1',
                  }}
                />
              )}
            />

            <Button
              type="submit"
              color="primary"
              className="mt-2"
              isLoading={isPending}
              fullWidth
            >
              Sign In
            </Button>
          </Form>
        </CardBody>
      </Card>
    </motion.div>
  )
}
