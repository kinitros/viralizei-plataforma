import React, { useState, useEffect } from 'react';
import { X, Copy, QrCode, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { pixService, CreatePixRequest } from '../services/pix';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixData: {
    qrCode: string;
    qrCodeBase64: string;
    copyPasteCode: string;
    orderId: string;
    expirationAt: string;
  } | null;
  onPaymentConfirmed: () => void;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  isOpen,
  onClose,
  pixData,
  onPaymentConfirmed,
}) => {
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (pixData && pixData.expirationAt) {
      const expirationTime = new Date(pixData.expirationAt).getTime();
      const now = new Date().getTime();
      const timeLeft = Math.max(0, Math.floor((expirationTime - now) / 1000));
      setCountdown(timeLeft);
    }
  }, [pixData]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (pixData && !isCheckingStatus) {
      const checkInterval = setInterval(async () => {
        const statusResponse = await pixService.checkPixStatus(pixData.orderId);
        if (statusResponse.success && statusResponse.data?.status === 'Pago') {
          clearInterval(checkInterval);
          onPaymentConfirmed();
        }
      }, 5000); // Verifica a cada 5 segundos

      return () => clearInterval(checkInterval);
    }
  }, [pixData, isCheckingStatus, onPaymentConfirmed]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Código PIX copiado!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('Erro ao copiar código');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !pixData) return null;

  console.log('[PixPaymentModal] pixData recebido:', pixData);

  const qrSrc = pixData.qrCodeBase64 || pixData.qrCode || '';
  const isQrEmpty = !qrSrc || qrSrc.trim().length === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pagar com PIX</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="bg-gray-100 rounded-lg p-4 inline-block">
              {isQrEmpty ? (
                <div className="w-48 h-48 flex items-center justify-center text-gray-500">
                  QR indisponível. Use o código copia e cola.
                </div>
              ) : (
                <img
                  src={qrSrc}
                  alt="QR Code PIX"
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    console.warn('[PixPaymentModal] Falha ao carregar QR', pixData);
                    (e.target as HTMLImageElement).src = '/favicon.svg';
                  }}
                />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Escaneie o QR Code com seu aplicativo de banco
            </p>
          </div>

          {/* Código Copia e Cola */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ou copie o código abaixo:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pixData.copyPasteCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(pixData.copyPasteCode)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </button>
            </div>
          </div>

          {/* Contador */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
            <Clock className="w-4 h-4" />
            <span>Expira em: {formatTime(countdown)}</span>
          </div>

          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
              <span className="text-sm font-medium">
                Aguardando pagamento...
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Verificando status automaticamente
            </p>
          </div>

          {/* Botão de fechar */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};