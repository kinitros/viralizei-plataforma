# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## WhatsApp Floating Button

O projeto inclui um botão flutuante do WhatsApp que aparece no canto inferior direito de todas as páginas.

### Configuração Local

Para desenvolvimento local, configure as variáveis no arquivo `.env.local`:

```env
VITE_WHATSAPP_NUMBER=5511999999999
VITE_WHATSAPP_MESSAGE=Olá! Como posso ajudá-lo?
```

### Configuração no Netlify

Para que o botão apareça no deploy do Netlify, configure as variáveis de ambiente no painel:

1. Acesse o painel do Netlify
2. Vá em **Site settings > Environment variables**
3. Adicione as seguintes variáveis:
   - `VITE_WHATSAPP_NUMBER`: Número do WhatsApp (formato: 5511999999999)
   - `VITE_WHATSAPP_MESSAGE`: Mensagem padrão (opcional)

### Comportamento

- O botão só aparece se `VITE_WHATSAPP_NUMBER` estiver configurado
- Ao clicar, abre o WhatsApp Web/App com a mensagem pré-definida
- Possui animações suaves e design responsivo
- Fica fixo no canto inferior direito com alta prioridade (z-index: 9999)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
