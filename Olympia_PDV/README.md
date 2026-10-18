# Olympia PDV

Ponto de venda da **Olympia Body Fitness**: vendas, estoque por tamanho e cor, clientes, entregas e fluxo de caixa.
A interface é clara e limpa, com a marca em dourado, preto e prata.

## Como rodar

```bash
cd Olympia_PDV
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera a versão final em dist/
```

Na primeira vez que abrir, o sistema pede o nome da loja e cria o usuário **administrador**. Você pode
carregar produtos de exemplo para testar.

## O que tem

| Módulo | Recursos |
| --- | --- |
| **Vender (PDV)** | Busca por nome, marca ou código (leitor de código de barras: Enter adiciona direto) · filtros por categoria/subcategoria · grade cor × tamanho mostrando o estoque · desconto em R$ ou % · cliente opcional (busca ou cadastro na hora) · **entrega** opcional: abre um bloco para destinatário, telefone, endereço com CEP automático, taxa, horário e observações, ou busca o cliente cadastrado e preenche tudo · atalhos F4 (buscar) e F2 (finalizar) |
| **Pagamento** | Dinheiro, PIX, crédito (com parcelas), débito e vale-troca · **combinar formas** (botão *Dividir*) · troco automático · valores rápidos para dinheiro |
| **Pedidos** | Salvos automaticamente · impressão automática do cupom (térmica 58mm/80mm ou A4) · via de entrega com assinatura · reimpressão · cancelamento (somente admin) devolvendo estoque e lançando o estorno no caixa · status da entrega (pendente → saiu → entregue) · exportação para planilha (CSV) |
| **Produtos** | Cadastre **1 modelo** e já monte a grade: tamanhos (atalhos PP–XG, 34–46, Único ou personalizados), cores (paleta pronta ou cor nova) e quantidade de cada combinação · marca · categoria e subcategoria · preço, custo e margem · foto · duplicar produto com a mesma grade |
| **Estoque** | Posição por variação · alerta de estoque baixo · entrada de mercadoria, saída (defeito, perda, uso interno…) e inventário usando a mesma grade · histórico completo de movimentações · valor do estoque a custo e a preço de venda |
| **Categorias e marcas** | Árvore de categorias com subcategorias · cadastro de marcas |
| **Clientes** | Cadastro com endereço (CEP automático), CPF, aniversário e observações · histórico de compras, total gasto e ticket médio · atalho para WhatsApp |
| **Caixa** | Abertura com fundo de troco · entradas (suprimentos) e retiradas (sangrias) · resumo **por forma de pagamento** · dinheiro esperado na gaveta · fechamento com valor contado e diferença · relatório impresso · histórico de caixas |
| **Usuários** | Funções **Administrador** e **Vendedor** · vendedor tem desconto limitado: acima do limite pede a senha de um administrador |
| **Configurações** | Dados e logo da loja no cupom · formato de impressão · formas de pagamento aceitas · parcelas · taxa de entrega padrão · vender sem estoque · **backup e restauração** |

### O que o vendedor pode fazer

Vender, cadastrar clientes, operar o caixa (abrir, registrar entradas e retiradas, fechar) e consultar estoque e produtos.
Cadastrar e editar produtos, mexer no estoque, cancelar vendas, gerenciar usuários e alterar configurações é só do administrador.

## Onde os dados ficam

Nesta primeira versão os dados ficam salvos **no próprio navegador/computador** (IndexedDB), e o sistema funciona
mesmo sem internet. Por isso:

- Use sempre o mesmo computador e o mesmo navegador no caixa.
- Baixe um **backup** em *Configurações → Backup* com frequência.

Para usar em vários computadores ou no celular com os mesmos dados, o próximo passo é ligar um banco de dados
na nuvem (ex.: Supabase). A camada de dados (`src/store`) já está separada para facilitar essa troca.

## Estrutura

```
src/
  store/        dados e regras de negócio (vendas, estoque, caixa, permissões) + persistência
  components/   componentes reutilizáveis (grade de variações, formulários, modais do PDV e do caixa)
  pages/        telas (PDV, Vendas, Produtos, Estoque, Categorias, Clientes, Caixa, Usuários, Configurações)
  utils/        formatação, CEP, impressão (cupom, via de entrega, relatório de caixa)
```
