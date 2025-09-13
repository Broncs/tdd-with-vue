vi.mock('axios')
import { render, screen } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import { describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

describe('Sign Up', () => {
  describe('when user sets same value for password inputs', () => {
    describe('when user submits form', () => {
      it('Sends username, email, password, to the backend', async () => {
        const user = userEvent.setup()
        render(SignUp)
        const usernameInput = screen.getByLabelText('Username')
        const emailInput = screen.getByLabelText('E-mail')
        const passwordInput = screen.getByLabelText('Password')
        const passwordRepeatInput = screen.getByLabelText('Password Repeat')

        await user.type(usernameInput, 'user1')
        await user.type(emailInput, 'teste@gmail.com')
        await user.type(passwordInput, 'P4ssword')
        await user.type(passwordRepeatInput, 'P4ssword')

        const button = screen.getByRole('button', { name: 'Sign Up' })
        await user.click(button)

        expect(axios.post).toHaveBeenCalledWith('/api/v1/users', {
          username: 'user1',
          email: 'teste@gmail.com',
          password: 'P4ssword',
        })
      })
    })
  })
})
