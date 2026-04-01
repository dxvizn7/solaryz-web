import { AnimatePresence } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
import { SolaryzNotification } from './index';

export function NotificationContainer() {
  const { notifications } = useNotification();

  return (
    <div className="fixed top-0 right-0 p-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <SolaryzNotification
              id={notification.id}
              type={notification.type}
              message={notification.message}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
