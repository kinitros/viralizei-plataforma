import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { packCheckoutData } from '../lib/encryption';

interface Product {
  id?: string;
  name: string;
  service_key: string;
  quantity: number;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  network: string;
  service_type: string;
  region: string;
  description: string;
  is_active: boolean;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

const networks = [
  'instagram', 'tiktok', 'facebook', 'twitter', 'youtube', 'kwai'
];

const serviceTypes = [
  'followers', 'likes', 'views', 'comments', 'shares', 'saves'
];

const regions = [
  'worldwide', 'brazil', 'usa', 'europe'
];

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({
    name: '',
    service_key: '',
    quantity: 1000,
    price: 9.90,
    discount_percentage: 0,
    network: 'instagram',
    service_type: 'followers',
    region: 'brazil',
    description: '',
    is_active: true
  });

  const buildCheckoutLink = (p: Product) => {
    const platform = p.network.toLowerCase();
    const data = packCheckoutData({ key: p.service_key, qty: p.quantity, price: p.price });
    return `/checkout/${platform}?data=${encodeURIComponent(data)}`;
  };

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
      setIsAuthed(true);
    }
  }, []);

  // Carregar produtos
  useEffect(() => {
    if (isAuthed) {
      loadProducts();
    }
  }, [isAuthed]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products', {
        headers: {
          'x-admin-token': adminToken
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }

      const data = await response.json();
      const list = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []);
      setProducts(list);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || adminToken.trim().length === 0) {
      setError('Informe um token válido');
      return;
    }

    localStorage.setItem('adminToken', adminToken);
    setIsAuthed(true);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthed(false);
    setAdminToken('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar produto');
      }

      setMessage(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
      
      // Limpar formulário
      setFormData({
        name: '',
        service_key: '',
        quantity: 1000,
        price: 9.90,
        discount_percentage: 0,
        network: 'instagram',
        service_type: 'followers',
        region: 'brazil',
        description: '',
        is_active: true
      });
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setError('Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': adminToken
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar produto');
      }

      setMessage('Produto deletado com sucesso!');
      loadProducts();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      setError('Erro ao deletar produto');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ is_active: !product.is_active })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar produto');
      }

      setMessage(`Produto ${!product.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      loadProducts();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setError('Erro ao atualizar produto');
    }
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Admin - Produtos</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token de Admin
              </label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o token de admin"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin - Produtos</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Novo Produto
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
            <button
              onClick={() => setMessage('')}
              className="float-right text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Key</label>
                <input
                  type="text"
                  value={formData.service_key}
                  onChange={(e) => setFormData({...formData, service_key: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="gerado automaticamente se vazio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rede Social</label>
                <select
                  value={formData.network}
                  onChange={(e) => setFormData({...formData, network: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {networks.map(network => (
                    <option key={network} value={network}>{network}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                <select
                  value={formData.service_type}
                  onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
                <input
                  type="number"
                  value={formData.discount_percentage || 0}
                  onChange={(e) => setFormData({...formData, discount_percentage: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Região</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Ativo</label>
              </div>

              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : (editingProduct ? 'Atualizar' : 'Criar')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Carregando produtos...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rede/Serviço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.service_key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.network} - {product.service_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {product.price.toFixed(2)}
                      {product.discount_percentage > 0 && (
                        <span className="text-green-600 ml-1">
                          (-{product.discount_percentage}%)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleActive(product)}
                        className={`${product.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {product.is_active ? 'Desativar' : 'Ativar'}
                      </button>
                      <a
                        href={buildCheckoutLink(product)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver Checkout"
                      >
                        Ver Checkout
                      </a>
                      <button
                        onClick={() => handleDelete(product.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum produto cadastrado
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
