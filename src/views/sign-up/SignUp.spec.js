import { render, screen, waitFor } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import { afterAll, beforeAll, beforeEach, describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const setup = async () => {
  const user = userEvent.setup()
  const result = render(SignUp)
  const usernameInput = screen.getByLabelText('Username')
  const emailInput = screen.getByLabelText('E-mail')
  const passwordInput = screen.getByLabelText('Password')
  const passwordRepeatInput = screen.getByLabelText('Password Repeat')

  await user.type(usernameInput, 'user1')
  await user.type(emailInput, 'teste@gmail.com')
  await user.type(passwordInput, 'P4ssword')
  await user.type(passwordRepeatInput, 'P4ssword')

  const button = screen.getByRole('button', { name: 'Sign Up' })
  return {
    ...result,
    user,
    elements: {
      button,
    },
  }
}
let requestBody
let counter = 0
const server = setupServer(
  http.post(window.location.origin + '/api/v1/users', async ({ request }) => {
    requestBody = await request.json()
    counter += 1
    return HttpResponse.json({ message: 'Usuário criado com sucesso' }, { status: 200 })
  }),
)

beforeEach(() => {
  counter = 0
})

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('Sign Up', () => {
  it('has Sign Up Header', () => {
    render(SignUp)
    const header = screen.getByRole('heading', { name: 'Sign Up' })
    expect(header).toBeInTheDocument()
  })

  it('has username input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })

  it('has email input', () => {
    render(SignUp)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('has password input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('has password type for password  input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('has password repeat input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Repeat')).toBeInTheDocument()
  })

  it('has password type for password repear  input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Repeat')).toHaveAttribute('type', 'password')
  })
  it('has Sign Up button', () => {
    render(SignUp)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    expect(button).toBeInTheDocument()
  })
  it(' disables the button initially', () => {
    render(SignUp)
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled()
  })

  it('does not display spinner', () => {
    render(SignUp)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  describe('when user sets same value for password inputs', () => {
    it('enables button', async () => {
      const {
        elements: { button },
      } = await setup()

      expect(button).toBeEnabled()
    })
  })

  describe('when user submits form', () => {
    it('Sends username, email, password, to the backend', async () => {
      const {
        user,
        elements: { button },
      } = await setup()

      await user.click(button)

      await waitFor(() => {
        expect(requestBody).toEqual({
          username: 'user1',
          email: 'teste@gmail.com',
          password: 'P4ssword',
        })
      })
    })

    it.only('should has 200 ok status and there is response body  with a message property.', async () => {
      let responseMessage = ''
      server.use(
        http.post('/api/v1/users', async ({ request }) => {
          requestBody = await request.json()
          counter += 1
          responseMessage = 'Usuário criado com sucesso'
          return HttpResponse.json({ message: 'Usuário criado com sucesso' }, { status: 200 })
        }),
      )

      const {
        user,
        elements: { button },
      } = await setup()

      await user.click(button)
      await waitFor(() => {
        expect(requestBody).toEqual({
          username: 'user1',
          email: 'teste@gmail.com',
          password: 'P4ssword',
        })

        expect(counter).toBe(1)
        expect(responseMessage).toBe('Usuário criado com sucesso')
        expect(screen.getByTestId('response-message')).toBeInTheDocument()
      })
    })
  })

  describe('when there is an ongoing api call', () => {
    it('does not allow clicking the button', async () => {
      const {
        user,
        elements: { button },
      } = await setup()

      await user.click(button)
      await user.click(button)

      await waitFor(() => {
        expect(counter).toBe(1)
      })
    })

    it('displays spinner', async () => {
      const {
        user,
        elements: { button },
      } = await setup()

      await user.click(button)

      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })
})
