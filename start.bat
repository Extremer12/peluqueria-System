@echo off
echo Iniciando servidor de peluqueria...
cd server
start "Servidor" cmd /k "npm start"
cd ..
echo Esperando 3 segundos...
timeout /t 3 /nobreak > nul
cd client
start "Cliente" cmd /k "npm start"
cd ..
echo Sistema iniciado!
echo Servidor: http://localhost:3001
echo Cliente: http://localhost:3000
pause