import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../../../components/Layout';
import { api } from '../../../config/api';
import { User, Mail, Lock, Camera, Trash2, Save, AlertCircle, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

export function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // States for Image Cropping
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await api.put('user/profile', { name });
      updateUser(response.data);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar perfil.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    setIsUpdating(true);
    try {
      await api.put('user/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      alert('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      alert('Erro ao alterar senha. Verifique a senha atual.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return;

    setIsUpdating(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      if (!croppedImage) throw new Error('Falha ao processar imagem');

      const formData = new FormData();
      formData.append('avatar', croppedImage, 'avatar.jpg');

      const response = await api.post('user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(response.data);
      setShowCropper(false);
      setImage(null);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.status === 404 
        ? 'Erro: Rota "user/avatar" não encontrada no backend. Por favor, verifique se o endpoint está correto.'
        : 'Erro ao enviar foto.';
      alert(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Tem certeza que deseja deletar sua conta? Esta ação é irreversível.');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await api.delete('user/account');
      alert('Conta deletada com sucesso.');
      window.location.href = '/login';
    } catch (error) {
      console.error(error);
      alert('Erro ao deletar conta.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout title="Meu Perfil">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-solar-dark border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name} 
                    className="w-32 h-32 rounded-full border-4 border-solar-orange/20 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-solar-yellow/20 flex items-center justify-center text-solar-orange text-4xl font-bold border-4 border-solar-orange/20">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>

            <div className="mt-6 bg-red-400/5 border border-red-400/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertCircle size={18} />
                <h3 className="font-semibold text-sm">Zona de perigo</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Ao deletar sua conta, todos os seus dados serão removidos permanentemente.
              </p>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Deletando...' : 'Deletar Conta'}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-solar-dark border border-white/5 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <User size={20} className="text-solar-orange" />
                Informações do Perfil
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-solar-orange/50 transition-colors text-sm"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">E-mail (não pode ser alterado)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="email" 
                      value={user?.email}
                      readOnly
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white/40 cursor-not-allowed text-sm"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-solar-orange to-solar-yellow text-solar-dark font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    <Save size={18} />
                    {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-solar-dark border border-white/5 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Lock size={20} className="text-solar-orange" />
                Segurança
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Senha atual</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-solar-orange/50 transition-colors text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Nova senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-solar-orange/50 transition-colors text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirmar nova senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-solar-orange/50 transition-colors text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Lock size={18} />
                    {isUpdating ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showCropper && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-solar-dark border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Ajustar Foto de Perfil</h3>
              <button 
                onClick={() => setShowCropper(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="relative h-96 w-full bg-black/40">
              <Cropper
                image={image as string}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            <div className="p-6 bg-solar-dark">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <ZoomOut className="text-gray-400" size={18} />
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={(e: any) => setZoom(e.target.value)}
                      className="flex-1 accent-solar-orange"
                    />
                    <ZoomIn className="text-gray-400" size={18} />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <RotateCcw className="text-gray-400" size={18} />
                    <input
                      type="range"
                      value={rotation}
                      min={0}
                      max={360}
                      step={1}
                      onChange={(e: any) => setRotation(e.target.value)}
                      className="flex-1 accent-solar-orange"
                    />
                    <span className="text-xs text-gray-500 w-8">{rotation}°</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowCropper(false)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveCroppedImage}
                    disabled={isUpdating}
                    className="px-8 py-2.5 bg-gradient-to-r from-solar-orange to-solar-yellow text-solar-dark font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    {isUpdating ? 'Processando...' : 'Salvar Foto'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
