# Configuração do Supabase

Este diretório contém os arquivos de configuração e migrações para o banco de dados Supabase do projeto MeuAppDeCompras.

## Estrutura

- `config.toml`: Arquivo de configuração do Supabase CLI
- `migrations/`: Pasta contendo os arquivos SQL de migração para criar as tabelas do banco de dados

## Como aplicar as migrações

Para aplicar as migrações ao banco de dados Supabase, siga os passos abaixo:

1. Faça login no Supabase CLI:
   ```
   npx supabase login
   ```
   Você precisará fornecer seu token de acesso do Supabase, que pode ser obtido em https://supabase.com/dashboard/account/tokens

2. Vincule seu projeto local ao projeto remoto do Supabase:
   ```
   npx supabase link --project-ref xixrouxvfqnmbdpdkytg
   ```
   Você precisará fornecer a senha do banco de dados: `4o1cXfTg8kHFFEU4`

3. Verifique as diferenças entre o banco de dados local e remoto:
   ```
   npx supabase db diff
   ```

4. Aplique as migrações ao banco de dados remoto:
   ```
   npx supabase db push
   ```

## Tabelas criadas

As seguintes tabelas serão criadas no banco de dados:

1. `usuarios`: Armazena informações dos usuários do aplicativo
2. `listas_de_compras`: Armazena as listas de compras criadas pelos usuários
3. `itens`: Armazena os itens adicionados às listas de compras
4. `compartilhamentos`: Gerencia o compartilhamento de listas entre usuários
5. `receitas`: Armazena receitas criadas pelos usuários
6. `ingredientes_de_receitas`: Relaciona receitas com seus ingredientes
7. `localizacoes`: Armazena informações de localização dos usuários

## Comandos úteis

- `npx supabase db pull`: Puxa o esquema do banco de dados remoto
- `npx supabase db push`: Envia novas migrações para o banco de dados remoto
- `npx supabase db diff`: Mostra diferenças entre o banco de dados local e remoto
- `npx supabase db dump`: Faz backup de dados ou esquemas do banco de dados remoto
- `npx supabase db reset`: Reseta o banco de dados local para as migrações atuais