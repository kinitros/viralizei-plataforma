import React, { useEffect, useState } from 'react';

interface LinkEntry {
  key: string;
  qty?: number;
  url: string;
}

interface StoreResponse {
  links: Record<string, string>;
}

const AdminCheckout: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [store, setStore] = useState<StoreResponse>({ links: {} });
  const [form, setForm] = useState<LinkEntry>({ key: '', qty: undefined, url: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const saved = sessionStorage.getItem('ADMIN_TOKEN');
    if (saved) {
      setToken(saved);
      setIsAuthed(true);
      fetchStore(saved);
    }
  }, []);

  // Catálogo de chaves e quantidades por rede/social
  const catalog: { network: string; items: { label: string; key: string; qtys: number[] }[] }[] = [
    {
      network: 'Instagram',
      items: [
        { label: 'Seguidores BR', key: 'instagram.followers.br', qtys: [250, 500, 1000, 2000, 3000, 5000] },
        { label: 'Seguidores Mundiais', key: 'instagram.followers.world', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Curtidas BR', key: 'instagram.likes.br', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Curtidas Mundiais', key: 'instagram.likes.world', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Views Reels', key: 'instagram.views.reels', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Views Stories', key: 'instagram.views.stories', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
      ],
    },
    {
      network: 'TikTok',
      items: [
        { label: 'Curtidas BR', key: 'tiktok.likes.br', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Curtidas Mundiais', key: 'tiktok.likes.world', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Seguidores BR', key: 'tiktok.followers.br', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Seguidores Mundiais', key: 'tiktok.followers.world', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Views', key: 'tiktok.views', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
      ],
    },
    {
      network: 'Facebook',
      items: [
        { label: 'Curtidas', key: 'facebook.likes.world', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Visualizações', key: 'facebook.views', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Seguidores Mundiais', key: 'facebook.followers.world', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
      ],
    },
    {
      network: 'X (Twitter)',
      items: [
        { label: 'Curtidas', key: 'twitter.likes', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Visualizações', key: 'twitter.views', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Seguidores', key: 'twitter.followers', qtys: [250, 500, 1000, 2000, 3000, 5000] },
      ],
    },
    {
      network: 'YouTube',
      items: [
        { label: 'Visualizações', key: 'youtube.views', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Curtidas', key: 'youtube.likes', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Inscritos', key: 'youtube.subscribers', qtys: [100, 300, 500, 1000, 1500, 2000] },
      ],
    },
    {
      network: 'Kwai',
      items: [
        { label: 'Curtidas BR', key: 'kwai.likes.br', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Visualizações', key: 'kwai.views', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
        { label: 'Seguidores BR', key: 'kwai.followers.br', qtys: [500, 1000, 2000, 3000, 5000, 10000] },
      ],
    },
  ];

  const applyCatalog = (key: string, qty?: number) => {
    setForm((f) => ({ ...f, key, qty }));
    setMessage('Chave e quantidade preenchidas pelo catálogo');
  };

  const fetchStore = async (tkn: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/checkout', {
        headers: {
          Authorization: `Bearer ${tkn}`,
        },
      });
      if (!res.ok) {
        setMessage('Falha ao carregar store');
        setIsAuthed(false);
        return;
      }
      const data = (await res.json()) as StoreResponse;
      setStore(data);
      setMessage('Store carregado');
    } catch (e) {
      setMessage('Erro ao carregar store');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!token) {
      setMessage('Informe o token');
      return;
    }
    sessionStorage.setItem('ADMIN_TOKEN', token);
    setIsAuthed(true);
    await fetchStore(token);
  };

  const handleSave = async () => {
    if (!form.key || !form.url) {
      setMessage('Preencha chave e URL');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/admin/checkout/link', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage('Erro ao salvar link');
        return;
      }
      setMessage('Link salvo com sucesso');
      setForm({ key: '', qty: undefined, url: '' });
      await fetchStore(token);
    } catch (e) {
      setMessage('Erro ao salvar link');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fullKey: string) => {
    try {
      setLoading(true);
      const [key, qtyPart] = fullKey.split('.');
      const qty = qtyPart === 'default' ? undefined : Number(qtyPart);
      const res = await fetch('/api/admin/checkout/link', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key, qty }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage('Erro ao remover link');
        return;
      }
      setMessage('Link removido');
      await fetchStore(token);
    } catch (e) {
      setMessage('Erro ao remover link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-4">Admin - Links de Checkout</h1>
      <p className="text-gray-600 mb-6">Gerencie os links usados nos botões "Comprar Agora" sem editar código.</p>

      {!isAuthed && (
        <div className="bg-white shadow p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Autenticação</h2>
          <input
            type="password"
            placeholder="Token de Admin"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border rounded p-2 mb-3"
          />
          <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Entrar</button>
          {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
        </div>
      )}

      {isAuthed && (
        <>
          <div className="bg-white shadow p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-4">Adicionar/Atualizar Link</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Chave (ex: instagram.followers.br)"
                value={form.key}
                onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                className="border rounded p-2"
              />
              <input
                type="number"
                placeholder="Qtd (opcional)"
                value={form.qty ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value ? Number(e.target.value) : undefined }))}
                className="border rounded p-2"
              />
              <input
                type="url"
                placeholder="URL do checkout"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="border rounded p-2"
              />
            </div>
            <div className="mt-3">
              <button onClick={handleSave} disabled={loading} className="bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded">
                Salvar Link
              </button>
              {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
            </div>
          </div>

          {/* Catálogo por Rede */}
          <div className="bg-white shadow p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-3">Catálogo por Rede</h2>
            {catalog.map((net) => (
              <div key={net.network} className="mb-5">
                <h3 className="text-lg font-semibold mb-2">{net.network}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {net.items.map((item) => (
                    <div key={item.key} className="border rounded p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-gray-500 text-xs">{item.key}</div>
                        </div>
                        <button
                          className="text-blue-600 text-sm hover:underline"
                          onClick={() => applyCatalog(item.key)}
                          title="Usar link default (sem quantidade)"
                        >
                          Default
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.qtys.map((q) => (
                          <button
                            key={q}
                            onClick={() => applyCatalog(item.key, q)}
                            className="px-2 py-1 rounded border text-sm hover:bg-gray-100"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500">Clique em uma quantidade para preencher chave e qtd. "Default" usa o link padrão sem quantidade.</p>
          </div>

          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Links Configurados</h2>
            {loading && <p>Carregando...</p>}
            {!loading && (
              <ul className="space-y-2">
                {Object.entries(store.links).length === 0 && (
                  <li className="text-gray-500">Nenhum link configurado ainda.</li>
                )}
                {Object.entries(store.links).map(([fullKey, url]) => (
                  <li key={fullKey} className="flex items-center justify-between border p-2 rounded">
                    <div>
                      <div className="font-medium">{fullKey}</div>
                      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">{url}</a>
                    </div>
                    <button onClick={() => handleDelete(fullKey)} className="text-red-600 border border-red-600 px-3 py-1 rounded">
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCheckout;