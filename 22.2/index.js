// Подключение необходимых модулей
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Создание приложения
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Массив для хранения зарегистрированных пользователей
const users = [];

// Регистрация пользователя
app.post('/register', (req, res) => {
  const { email, password, avatar, phoneNumber, country } = req.body;
  const newUser = {
    email,
    password,
    avatar,
    phoneNumber,
    country,
    verified: false
  };
  users.push(newUser);
  
  // Отправка письма с ссылкой для верификации
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_password'
    }
  });
  
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Please verify your email',
    text: 'Click the following link to verify your email: http://localhost:3000/verify?email=' + email
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  
  res.send('User registered successfully. Please verify your email.');
});

// Верификация почты
app.get('/verify', (req, res) => {
  const email = req.query.email;
  const user = users.find(user => user.email === email);
  if (user) {
    user.verified = true;
    res.send('Email verified successfully.');
  } else {
    res.status(404).send('User not found.');
  }
});

// Авторизация пользователя
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email && user.password === password);
  if (user && user.verified) {
    res.send('User logged in successfully.');
  } else {
    res.status(401).send('Invalid credentials or email not verified.');
  }
});

// Восстановление пароля
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(user => user.email === email);
  if (user) {
    const newPassword = Math.random().toString(36).substring(7);
    user.password = newPassword;
    res.send('New password generated: ' + newPassword);
  } else {
    res.status(404).send('User not found.');
  }
});

// Ограничение доступа
app.use((req, res, next) => {
  if (!users.find(user => user.email === req.headers.email)) {
    res.status(403).send('Access forbidden. Please log in.');
  } else {
    next();
  }
});

// Создание продукта
app.post('/products', (req, res) => {
  const product = {
    name: req.body.name,
    user: req.headers.email
  };
  // Добавление продукта к авторизованному пользователю
  // Дальнейшие действия с продуктом
  res.send('Product created successfully.');
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
