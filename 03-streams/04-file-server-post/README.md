# Файловый сервер - запись файла

В данной задаче вам необходимо будет реализовать http-сервер, который по запросу пользователя 
создавать файл на диске и записывать туда тело запроса.

- `POST /[filename]` - создание нового файла в папке `files` и запись в него тела запроса.
    - Если файл уже есть на диске - сервер должен вернуть ошибку `409`.
    - Максимальный размер загружаемого файла не должен превышать 1МБ, при превышении лимита - ошибка
    `413`.
    - Если в процессе загрузки файла на сервер произошел обрыв соединения — созданный файл с диска 
    надо удалять.
    - Вложенные папки не поддерживаются, при запросе вида `/dir1/dir2/filename` - ошибка `400`.
    
При любых ошибках сервер должен, по возможности, возвращать ошибку `500`.

Для ограничения размера загружаемого файла можно воспользоваться классом `LimitSizeStream` из 1-ой задачи 
модуля.

Для выполнения запросов можно воспользоваться программой `postman`. Проверить правильность 
реализации можно также с помощью тестов.

Запуск приложения осуществляется с помощью команды `node index.js`.
