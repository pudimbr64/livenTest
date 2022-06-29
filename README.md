# LivenTest
APIs para o teste da Liven

## Versão do Node
Foi testado com a versão 16 do node.

## Instalação de Dependências

Rode ```yarn``` ou ```npm install``` na pasta root do projeto para baixar e instalar as dependências.

## Configuração do Banco de Dados

É preciso criar um banco de dados MYSQL. Após criar o banco com o nome desejado, configure o arquivo .env, com base no exemplo providenciado, com os dados do banco e credenciais. Por fim, rode ```ỳarn migrate``` ou ```npm run migrate``` para criar as tabelas necessárias no banco.

## Configuração da JWT_SECRET_KEY

É preciso também configurar o arquivo .env com a JWT_SECRET_KEY. Para isso execute ```node``` no terminal na pasta root do projeto. Após isso, execute ```crypto.randomBytes(60).toString('hex');``` e cole o resultado no arquivo .env .

## Rodando a Aplicação

Rode o comando ```yarn start``` ou ```npm run start``` e abra ```http://localhost:5000/api-docs``` em seu navegador para visualizar a documentação swagger e testar as requisições.

## Coleção Postman

Foi incluso no repositório o JSON da coleção do postman.
