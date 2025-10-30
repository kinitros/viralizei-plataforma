import { StorageProviderFactory } from "../providers/StorageProviderFactory";
import { RedirectLink } from "../types/RedirectLink";
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '../.env' });

async function testSupabaseCRUD() {
  console.log('🚀 Iniciando testes de integração com Supabase...\n');

  try {
    // Verificar configuração
    console.log('📋 Verificando configuração:');
    console.log(`- STORAGE_PROVIDER: ${process.env.STORAGE_PROVIDER}`);
    console.log(`- SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado'}`);
    console.log(`- SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Não configurado'}\n`);

    // Obter provider de storage
    const storageProvider = StorageProviderFactory.getProvider();
    if (!storageProvider) {
      throw new Error('❌ Falha ao obter provider de storage');
    }
    console.log('✅ Provider de storage obtido com sucesso\n');

    // Dados de teste
    const testLink: Omit<RedirectLink, 'id' | 'createdAt' | 'updatedAt'> = {
      serviceKey: 'test-service-' + Date.now(),
      quantity: 100,
      url: 'https://example.com/test',
      description: 'Link de teste para validação CRUD',
      active: true
    };

    console.log('📝 Dados de teste:', testLink, '\n');

    // Teste 1: CREATE
    console.log('🔄 Teste 1: Criando link...');
    const createdLink = await storageProvider.createLink(testLink);
    console.log('✅ Link criado:', {
      id: createdLink.id,
      serviceKey: createdLink.serviceKey,
      url: createdLink.url
    });
    console.log('');

    // Teste 2: READ (buscar por service key)
    console.log('🔄 Teste 2: Buscando link por service key...');
    const foundByServiceKey = await storageProvider.findLink(createdLink.serviceKey);
    if (foundByServiceKey) {
      console.log('✅ Link encontrado por service key:', {
        id: foundByServiceKey.id,
        serviceKey: foundByServiceKey.serviceKey,
        url: foundByServiceKey.url
      });
    } else {
      throw new Error('❌ Link não encontrado por service key');
    }
    console.log('');

    // Teste 3: LIST
    console.log('🔄 Teste 3: Listando todos os links...');
    const allLinks = await storageProvider.getAllLinks();
    console.log(`✅ Total de links encontrados: ${allLinks.length}`);
    const testLinks = allLinks.filter(link => link.serviceKey.startsWith('test-service-'));
    console.log(`✅ Links de teste encontrados: ${testLinks.length}`);
    console.log('');

    // Teste 4: UPDATE
    console.log('🔄 Teste 4: Atualizando link...');
    const updatedData = {
      url: 'https://example.com/updated-test',
      description: 'Link de teste atualizado',
      quantity: 200
    };
    const updatedLink = await storageProvider.updateLink(createdLink.id, updatedData);
    if (updatedLink) {
      console.log('✅ Link atualizado:', {
        id: updatedLink.id,
        url: updatedLink.url,
        description: updatedLink.description,
        quantity: updatedLink.quantity
      });
    } else {
      throw new Error('❌ Falha ao atualizar link');
    }
    console.log('');

    // Teste 5: DELETE
    console.log('🔄 Teste 5: Deletando link...');
    const deleteResult = await storageProvider.deleteLink(createdLink.id);
    if (deleteResult) {
      console.log('✅ Link deletado:', {
        id: deleteResult.id,
        serviceKey: deleteResult.serviceKey
      });
    } else {
      throw new Error('❌ Falha ao deletar link');
    }
    console.log('');

    // Teste 6: Verificar se foi realmente deletado
    console.log('🔄 Teste 6: Verificando se link foi deletado...');
    const deletedLink = await storageProvider.findLink(createdLink.serviceKey);
    if (!deletedLink) {
      console.log('✅ Confirmado: Link foi deletado com sucesso');
    } else {
      throw new Error('❌ Link ainda existe após deleção');
    }
    console.log('');

    console.log('🎉 Todos os testes passaram! Integração com Supabase está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    process.exit(1);
  }
}

// Executar testes
testSupabaseCRUD();