type Listener = (notification: { type: 'error' | 'success' | 'info'; message: string } | null) => void;

class NotificationService {
  private listener: Listener | null = null;

  subscribe(listener: Listener) {
    this.listener = listener;
    return () => {
      this.listener = null;
    };
  }

  show(type: 'error' | 'success' | 'info', message: string) {
    if (this.listener) {
      this.listener({ type, message });
    }
  }

  error(message: string) {
    this.show('error', message);
  }

  success(message: string) {
    this.show('success', message);
  }
}

export const notificationService = new NotificationService();
