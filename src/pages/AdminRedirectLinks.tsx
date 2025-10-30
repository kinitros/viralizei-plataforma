import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ExternalLink, Save, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RedirectLink {
  id: string;
  serviceKey: string;
  quantity?: number;
  url: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  serviceKey: string;
  quantity: string;
  url: string;
  description: string;
}

const PREDEFINED_SERVICES = [
  // ===== INSTAGRAM =====
  { key: 'instagram.followers.br', label: 'Instagram - Seguidores Brasil' },
  { key: 'instagram.followers.world', label: 'Instagram - Seguidores Mundial' },
  { key: 'instagram.likes.br', label: 'Instagram - Curtidas Brasil' },
  { key: 'instagram.likes.world', label: 'Instagram - Curtidas Mundial' },
  { key: 'instagram.views.reels', label: 'Instagram - Visualizações Reels' },
  { key: 'instagram.views.stories', label: 'Instagram - Visualizações Stories' },
  
  // ===== TIKTOK =====
  { key: 'tiktok.followers.br', label: 'TikTok - Seguidores Brasil' },
  { key: 'tiktok.followers.world', label: 'TikTok - Seguidores Mundial' },
  { key: 'tiktok.likes.br', label: 'TikTok - Curtidas Brasil' },
  { key: 'tiktok.likes.world', label: 'TikTok - Curtidas Mundial' },
  { key: 'tiktok.views', label: 'TikTok - Visualizações' },
  
  // ===== YOUTUBE =====
  { key: 'youtube.subscribers', label: 'YouTube - Inscritos' },
  { key: 'youtube.likes', label: 'YouTube - Curtidas' },
  { key: 'youtube.views', label: 'YouTube - Visualizações' },
  
  // ===== FACEBOOK =====
  { key: 'facebook.followers.world', label: 'Facebook - Seguidores' },
  { key: 'facebook.likes.world', label: 'Facebook - Curtidas' },
  { key: 'facebook.views', label: 'Facebook - Visualizações' },
  
  // ===== TWITTER/X =====
  { key: 'twitter.followers', label: 'Twitter/X - Seguidores' },
  { key: 'twitter.likes', label: 'Twitter/X - Curtidas' },
  { key: 'twitter.views', label: 'Twitter/X - Visualizações' },
  
  // ===== KWAI =====
  { key: 'kwai.followers.br', label: 'Kwai - Seguidores Brasil' },
  { key: 'kwai.likes.br', label: 'Kwai - Curtidas Brasil' },
  { key: 'kwai.views', label: 'Kwai - Visualizações' },
];

export default function AdminRedirectLinks() {
  const [links, setLinks] = useState<RedirectLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<RedirectLink | null>(null);
  const [formData, setFormData] = useState<FormData>({
    serviceKey: '',
    quantity: '',
    url: '',
    description: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  // Carregar links
  const loadLinks = async () => {
    try {
      setLoading(true);
      const adminPassword = sessionStorage.getItem('adminPassword') || '';
      if (!adminPassword) {
        navigate('/admin/login');
        return;
      }
      const response = await fetch('/api/redirect-links', {
        headers: {
          'x-admin-password': adminPassword,
        },
      });
      if (response.status === 401 || response.status === 403) {
        setError('Não autorizado. Faça login novamente.');
        navigate('/admin/login');
        return;
      }
      const result = await response.json();
      if (result.success) {
        setLinks(result.data);
      } else {
        setError('Erro ao carregar links');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminPassword = sessionStorage.getItem('adminPassword');
    if (!adminPassword) {
      navigate('/admin/login');
      return;
    }
    loadLinks();
  }, []);

  // Limpar mensagens após 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      serviceKey: '',
      quantity: '',
      url: '',
      description: ''
    });
    setEditingLink(null);
    setShowForm(false);
  };

  // Abrir formulário para edição
  const openEditForm = (link: RedirectLink) => {
    setFormData({
      serviceKey: link.serviceKey,
      quantity: link.quantity?.toString() || '',
      url: link.url,
      description: link.description || ''
    });
    setEditingLink(link);
    setShowForm(true);
  };

  // Salvar link (criar ou atualizar)
  const saveLink = async () => {
    try {
      setError('');
      
      // Validações
      if (!formData.serviceKey || !formData.url) {
        setError('Serviço e URL são obrigatórios');
        return;
      }

      // Validar URL
      try {
        new URL(formData.url);
      } catch {
        setError('URL inválida');
        return;
      }

      const payload = {
        serviceKey: formData.serviceKey,
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        url: formData.url,
        description: formData.description
      };
      const adminPassword = sessionStorage.getItem('adminPassword') || '';
      if (!adminPassword) {
        navigate('/admin/login');
        return;
      }
      let response;
      if (editingLink) {
        response = await fetch(`/api/redirect-links/${editingLink.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/redirect-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
          body: JSON.stringify(payload)
        });
      }
      if (response.status === 401 || response.status === 403) {
        setError('Não autorizado. Faça login novamente.');
        navigate('/admin/login');
        return;
      }
      const result = await response.json();
      if (result.success) {
        setSuccess(editingLink ? 'Link atualizado com sucesso!' : 'Link criado com sucesso!');
        resetForm();
        loadLinks();
      } else {
        setError(result.message || 'Erro ao salvar link');
      }
    } catch (err) {
      setError('Erro de conexão');
    }
  };

  // Deletar link
  const deleteLink = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este link?')) return;
    try {
      const adminPassword = sessionStorage.getItem('adminPassword') || '';
      if (!adminPassword) {
        navigate('/admin/login');
        return;
      }
      const response = await fetch(`/api/redirect-links/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': adminPassword },
      });
      if (response.status === 401 || response.status === 403) {
        setError('Não autorizado. Faça login novamente.');
        navigate('/admin/login');
        return;
      }
      const result = await response.json();
      if (result.success) {
        setSuccess('Link deletado com sucesso!');
        loadLinks();
      } else {
        setError(result.message || 'Erro ao deletar link');
      }
    } catch (err) {
      setError('Erro de conexão');
    }
  };

  // Testar link
  const testLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Gerenciar Links de Redirecionamento
          </h1>
          <p className="text-gray-300">
            Configure URLs customizadas para os botões "Comprar Agora" dos serviços
          </p>
        </motion.div>

        {/* Mensagens */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-center"
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-3 rounded-lg mb-6"
          >
            {success}
          </motion.div>
        )}

        {/* Botão Adicionar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Novo Link
          </button>
        </motion.div>

        {/* Formulário */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingLink ? 'Editar Link' : 'Novo Link'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2">Serviço</label>
                <select
                  value={formData.serviceKey}
                  onChange={(e) => setFormData({ ...formData, serviceKey: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Selecione um serviço</option>
                  {PREDEFINED_SERVICES.map(service => (
                    <option key={service.key} value={service.key} className="text-black">
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Quantidade (opcional)
                  <span className="text-gray-400 text-sm ml-2">
                    Deixe vazio para todas as quantidades
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Ex: 1000"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white mb-2">URL de Destino</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://exemplo.com/seu-link"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white mb-2">Descrição (opcional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do link"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={resetForm}
                className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveLink}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300"
              >
                <Save className="w-5 h-5 mr-2" />
                {editingLink ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Lista de Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden"
        >
          <div className="p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">Links Configurados</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-300">
              Carregando...
            </div>
          ) : links.length === 0 ? (
            <div className="p-8 text-center text-gray-300">
              Nenhum link configurado ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-white font-semibold">Serviço</th>
                    <th className="text-left p-4 text-white font-semibold">Quantidade</th>
                    <th className="text-left p-4 text-white font-semibold">URL</th>
                    <th className="text-left p-4 text-white font-semibold">Descrição</th>
                    <th className="text-left p-4 text-white font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link, index) => (
                    <motion.tr
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-gray-300">
                        {PREDEFINED_SERVICES.find(s => s.key === link.serviceKey)?.label || link.serviceKey}
                      </td>
                      <td className="p-4 text-gray-300">
                        {link.quantity || 'Todas'}
                      </td>
                      <td className="p-4 text-gray-300 max-w-xs truncate">
                        {link.url}
                      </td>
                      <td className="p-4 text-gray-300">
                        {link.description || '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => testLink(link.url)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Testar Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditForm(link)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Informações */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-blue-500/20 border border-blue-500 rounded-lg p-6"
        >
          <h3 className="text-white font-semibold mb-3">Como funciona:</h3>
          <ul className="text-blue-100 space-y-2">
            <li>• Configure URLs customizadas para redirecionar os botões "Comprar Agora"</li>
            <li>• Links específicos (com quantidade) têm prioridade sobre links gerais</li>
            <li>• Se nenhum link customizado for encontrado, o sistema padrão será usado</li>
            <li>• Use o botão de teste para verificar se o link está funcionando</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}