import React, { useState } from 'react'
import axios from 'axios'
import Modal from './Modal'
import './Modal.css'

const API = '/api'

const AuthForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [gender, setGender] = useState('male')
  const [agree, setAgree] = useState(false)
  const [token, setToken] = useState('')
  const [mode, setMode] = useState('register')
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowModal(false)
    setMessage('')

    if (mode === 'register' && !agree) {
      setMessage('Пожалуйста, подтвердите согласие на обработку персональных данных')
      return
    }

    try {
      const url = mode === 'register' ? `${API}/register` : `${API}/login`
      const payload = mode === 'register'
        ? { email, password, name, birthdate, gender }
        : { email, password }

      const res = await axios.post(url, payload)

      if (res.data.token) {
        setToken(res.data.token)
      }

      if (mode === 'register' && res.data.message === 'User registered') {
        setShowModal(true)
      } else {
        setMessage(res.data.message || 'Успешно!')
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Ошибка запроса')
    }
  }

  const handleCheckMe = async () => {
    try {
      const res = await axios.get(`${API}/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setMessage(`Привет, ${res.data.user.email}`)
    } catch (err) {
      setMessage('Ошибка токена')
    }
  }

  return (
    <div className="container">
      <h2>{mode === 'register' ? 'Регистрация' : 'Вход'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        /><br />

        {mode === 'register' && (
          <>
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            /><br />
            <input
              type="date"
              value={birthdate}
              onChange={e => setBirthdate(e.target.value)}
              required
            /><br />
            <div>
              Пол:
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={e => setGender(e.target.value)}
                />
                Мужской
              </label>
              <label style={{ marginLeft: '1rem' }}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={e => setGender(e.target.value)}
                />
                Женский
              </label>
            </div>
            <br />
            <label style={{ fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Я соглашаюсь с{' '}
              <a
                href="https://rkn.gov.ru/docs/pd_rules.pdf"
                target="_blank"
                rel="noreferrer"
              >
                правилами обработки персональных данных
              </a>
            </label>
            <br /><br />
          </>
        )}

        <button type="submit">
          {mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </form>

      <br />
      <button
        className="toggle-btn"
        onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
      >
        Переключить на {mode === 'register' ? 'вход' : 'регистрацию'}
      </button>

      <br /><br />
      {token && (
        <button onClick={handleCheckMe}>
          Проверить токен
        </button>
      )}

      <p>{message}</p>

      {showModal && (
        <Modal
          message="Регистрация прошла успешно!"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default AuthForm
