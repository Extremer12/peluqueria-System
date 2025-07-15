// Utilidades para manejar notificaciones push

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return;
  }
  
  if (Notification.permission === 'granted') {
    return new Notification(title, options);
  }
};

export const scheduleNotification = (title, options = {}, timeInMs) => {
  setTimeout(() => {
    sendNotification(title, options);
  }, timeInMs);
};