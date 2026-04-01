import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { type NotificationType, useNotification } from '../../contexts/NotificationContext';

interface SolaryzNotificationProps {
  id: string;
  type: NotificationType;
  message: string;
}

const icons = {
  success: <CheckCircle2 className="text-emerald-400" size={20} />,
  error: <XCircle className="text-[#E94822]" size={20} />,
  warning: <AlertTriangle className="text-[#F2910A]" size={20} />,
  info: <Info className="text-blue-400" size={20} />,
};

const borderColors = {
  success: 'border-emerald-500/20',
  error: 'border-[#E94822]/20',
  warning: 'border-[#F2910A]/20',
  info: 'border-blue-500/20',
};

const bgColors = {
  success: 'bg-emerald-500/5',
  error: 'bg-[#E94822]/5',
  warning: 'bg-[#F2910A]/5',
  info: 'bg-blue-500/5',
};

export function SolaryzNotification({ id, type, message }: SolaryzNotificationProps) {
  const { removeNotification } = useNotification();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
      className={`
        relative flex items-center gap-3 min-w-[320px] max-w-[420px] p-4
        bg-[#13141A]/90 backdrop-blur-xl border ${borderColors[type]} ${bgColors[type]}
        rounded-2xl shadow-2xl overflow-hidden
      `}
    >
      {/* Indicador lateral sutil */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        type === 'success' ? 'bg-emerald-500' : 
        type === 'error' ? 'bg-[#E94822]' : 
        type === 'warning' ? 'bg-[#F2910A]' : 'bg-blue-500'
      }`} />

      <div className="flex-shrink-0">
        {icons[type]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90 leading-tight">
          {message}
        </p>
      </div>

      <button
        onClick={() => removeNotification(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>

      {/* Barra de progresso visual opcional pode ser adicionada aqui se desejado */}
    </motion.div>
  );
}
