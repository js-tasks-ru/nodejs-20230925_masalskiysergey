# Настройка локальной стратегии

В этой задаче вам необходимо будет подключить и сконфигурировать стратегию `passport-local` для 
аутентификации пользователя по email и паролю.

## Метод для аутентификации:
| Метод | Ссылка     | Описание                 |
|-------|------------|--------------------------|
| POST  | /api/login | Аутентификация пользователя |

Схема взаимодействия клиента и сервера следующая:

1. Клиент отправляет на сервер запрос, где в теле указывается логин пользователя (email) и пароль:
    ```json
    {
      "email": "user1@mail.com",
      "password": "123123"
    }
    ```
2. В ответ сервер возвращает либо ответ с токеном либо ответ с ошибкой.

    На данный момент токен мы никуда сохранять не будем, после генерации с помощью модуля `uuid` он 
    будет отдаваться клиенту. В будущем этот токен станет ключом сессии, по которому мы сможем 
    определять, какой пользователь сделал запрос.

    Пример ответа в случае успешного логина:
    ```json
    {
      "token": "185e0c3a-d5a4-4211-8efe-1c377d8fd99d"
    }
    ```
    
    Пример ответа с ошибкой:
    ```json
    {
      "error": "Нет такого пользователя"
    }
    ```

Часть серверного кода уже написаны, сервер можно запустить, однако при отправке запроса, сервер 
всегда возвращает сообщение о том, что аутентификация пока не настроена нужным образом.
Измените, пожалуйста, файл `libs/strategies/local.js` таким образом, чтобы аутентификация 
выполнялась корректно. 

Требования к стратегии следующие:
- В случае если пользователя с переданным `email` нет в базе - стратегия должна вернуть сообщение
`Нет такого пользователя`. 
- В случае, если пользователь существует (`email` находится в базе данных), но пароль неверный - 
стратегия должна вернуть сообщение `Неверный пароль`. Функция для проверки пароля находится в 
методе `.checkPassword(password)` в модели пользователя. Она принимает в качестве аргумента строку с
паролем и возвращает промис, который резолвится либо в `true`, либо в `false`.  
- Если email и пароль правильные - стратегия должна вернуть объект пользователя.

Обратите внимание на опцию `session: false`, которая передается в настройки стратегии. Эту опцию 
убирать или изменять не надо - она сообщает паспорту о том, что не нужно использовать реализацию
сессий "по умолчанию", вместо этого мы воспользуемся своей - она находится в обработчике запроса на
`api/login` в файле `app.js`.

Вы можете запускать и тестировать приложение локально, для этого достаточно выполнить команду 
`node index.js`. В результате сервер будет запущен по адресу `http://localhost:3000`, где находится 
пользовательский интерфейс (небольшое приложение, написанное на React). Также вы можете тестировать
функциональность с помощью Postman.

Однако прежде, чем вы сможете успешно аутентифицироваться пользователей с логинами необходимо 
сохранить в базу данных. Это можно сделать с помощью команды `node fixtures/index.js`. В результате 
в базе данных будут сохранены два пользователя с логинами и паролями указанными в файле 
`data/users.json`.
