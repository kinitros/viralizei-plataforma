import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { pixService } from '../services/pix';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState<'checking' | 'paid' | 'pending' | 'error'>('checking');
  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      return;
    }

    checkPaymentStatus();
    
    // Verificar status a cada 5 segundos por até 2 minutos
    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 5000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (status === 'checking') {
        setStatus('pending');
      }
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await pixService.checkPixStatus(orderId!);
      if (response.success && response.data) {
        setTransactionData(response.data);
        if (response.data.status === 'Pago') {
          setStatus('paid');
        } else {
          setStatus('pending');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setStatus('error');
    }
  };

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-viral-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificando pagamento...</h1>
          <p className="text-gray-600">Estamos aguardando a confirmação do seu pagamento PIX.</p>
        </div>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento confirmado! 🎉</h1>
          <p className="text-gray-600 mb-6">Seu pagamento foi aprovado com sucesso.</p>
          
          {transactionData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pedido:</span>
                  <span className="font-medium">{transactionData.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium">{formatBRL(transactionData.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pago em:</span>
                  <span className="font-medium">{formatDate(transactionData.paid_at)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-viral-500 hover:bg-viral-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Voltar para o início
            </button>
            <p className="text-sm text-gray-500">
              Seu serviço será ativado em até 24 horas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Aguardando pagamento</h1>
          <p className="text-gray-600 mb-6">
            Seu pagamento ainda não foi confirmado. Você pode tentar novamente ou entrar em contato com o suporte.
          </p>
          
          {transactionData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pedido:</span>
                  <span className="font-medium">{transactionData.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium">{formatBRL(transactionData.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-yellow-600">{transactionData.status}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Voltar para o início
            </button>
            <button
              onClick={checkPaymentStatus}
              className="w-full bg-viral-500 hover:bg-viral-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Verificar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao processar</h1>
        <p className="text-gray-600 mb-6">
          Ocorreu um erro ao verificar seu pagamento. Por favor, entre em contato com o suporte.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-viral-500 hover:bg-viral-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Voltar para o início
          </button>
          <button
            onClick={checkPaymentStatus}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}