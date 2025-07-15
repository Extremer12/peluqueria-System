# ✂️ Sistema de Turnos PWA para Peluquería

Una aplicación web progresiva completa para gestionar turnos de peluquería, instalable como app nativa en Android e iOS.

## 🌟 Demo en Vivo

- **🌐 Aplicación**: [https://peluqueria-turnos.vercel.app](https://peluqueria-turnos.vercel.app)
- **🔧 API**: [https://peluqueria-backend.up.railway.app](https://peluqueria-backend.up.railway.app)

## ✨ Características Principales

### 👥 Para Clientes:
- 📱 **PWA Instalable**: Se instala como app nativa en cualquier dispositivo
- 📅 **Reserva Intuitiva**: Sistema fácil de reservas con calendario
- 🕐 **Horarios en Tiempo Real**: Ve disponibilidad instantánea
- 📋 **Gestión Personal**: Administra tus citas desde un panel
- 🔐 **Seguridad**: Autenticación segura con JWT
- 📱 **Responsive**: Funciona perfecto en móvil y desktop

### 👨‍💼 Para Administradores:
- 📊 **Dashboard Completo**: Estadísticas y métricas en tiempo real
- ✅ **Gestión de Turnos**: Confirma, cancela y organiza todas las citas
- 👥 **Base de Clientes**: Información completa de contacto
- 📈 **Reportes**: Analytics de rendimiento y ocupación
- 🎯 **Filtros Avanzados**: Organiza turnos por estado y fecha
- 📞 **Contacto Directo**: Acceso rápido a teléfonos de clientes

## 🚀 Despliegue y Configuración

### 🌐 Producción (Recomendado)
El sistema está desplegado y listo para usar:

1. **Accede a la aplicación**: [peluqueria-turnos.vercel.app](https://peluqueria-turnos.vercel.app)
2. **Login de Admin**: admin@peluqueria.com / admin123
3. **Clientes**: Registro libre desde la app

### 💻 Desarrollo Local

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/peluqueria-turnos.git
cd peluqueria-turnos

# 2. Instalar dependencias
npm run install:all

# 3. Configurar variables de entorno
# Editar server/.env con tus valores

# 4. Iniciar desarrollo
npm run dev
```

**URLs locales:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🛠️ Stack Tecnológico

### Frontend (React PWA)
- ⚛️ **React 18** - Framework principal
- 🧭 **React Router** - Navegación SPA
- 📡 **Axios** - Cliente HTTP
- 🎨 **CSS3** - Estilos responsive
- 📱 **PWA** - Service Workers 
## 🔧 Configuración de Producción

### Variables de Entorno
Edita `server/.env`:
```env
PORT=3001
JWT_SECRET=tu_clave_secreta_super_segura
```

### Build para Producción
```bash
npm run build
npm start
```

## 📋 Servicios Incluidos

- **Corte de Cabello** - 30 min - $15
- **Corte + Barba** - 45 min - $25  
- **Solo Barba** - 20 min - $12
- **Lavado + Corte** - 40 min - $20

## 🕐 Horarios de Trabajo

- **Mañana**: 9:00 - 12:00
- **Tarde**: 14:00 - 18:00
- **Intervalos**: Cada 30 minutos

## 🎯 Próximas Características

- [ ] Notificaciones push
- [ ] Recordatorios por WhatsApp
- [ ] Sistema de fidelización
- [ ] Múltiples peluqueros
- [ ] Reportes avanzados
- [ ] Integración con calendario

## 🤝 Soporte

¿Necesitas ayuda? Contacta al desarrollador o revisa la documentación técnica.

---

**¡Tu peluquería ahora tiene su propia app profesional! 💪**