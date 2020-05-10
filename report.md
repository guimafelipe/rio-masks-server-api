# Relatório

## Objetivo

O objetivo do projeto foi tentar criar uma plataforma livre onde pessoas pudessem consultar locais que vendem máscaras
perto de suas casas.  
Pra isso, foi pensado num site que exibe um mapa interativo, onde o usuário que entra pode verificar no mesmo locais perto
de sua residência que vendem máscaras, possibilitando a compra sem necessidade de grandes locomoções.
Além disso, pessoas podem inscrever suas lojas preenchendo um pequeno formulário também no site, dando informações de contato, 
localização e preço, que serão conferidas pelos donos do site que depois de entrar em contato com o vendedor manualmente inserem
suas informações na base de dados.
Detalhes sobre como cada uma dessas coisas foram feitas serão ditas posteriormente nesse texto.

## Ferramentas utilizadas

Como o site é bem simples, a stack utilizada foi Node.js com Express.js para servir de API e servidor do site. Além disso, 
o front-end foi desenvolvido com Vue,js devido à simplicidade, leveza e a vantagem de poder também manipular uma instância de
mapa pela biblioteca VueLayers (usando o mapa OpenLayers, disponível em open-source). Também usamos a API do OpenCage para
o sistema de geolocalização no modelo forward geocoding, usado para o usuário poder colocar o nome do seu bairro e o mapa
se concentrar nessa região.
Vamos agora falar um pouco de cada uma das tecnologias.

### Node.js
O node é uma solução bem leve e rápida para se prototipar um site comparado com outras opções (php, Ruby, Flask...). E devido
ao seu gerenciador de pacotes (NPM) fica fácil fazer deploy em vários lugares sem ter problema com bibliotecas e dependências.

#### Express.js
Além do node, usamos framework express, já famoso e difundido no mercado, para fazer de maneira rápida a API do backend 
(falaremos mais para frente dela) e para servir os arquivos do site.

### Outras bibliotecas

Além dessas, foram usadas outras bibliotecas para algumas tarefas mais simples, como enviar email. Todas elas dentro do 
gerenciados de pacotes do node.js, o NPM.

### Vue.js
Vue.js é um framework de frond-end usado para sites dinâmicos (esses sites de uma página que vão mudando as informações sem
ter que ficar atualizando a página inteira toda vez). É uma biblioteca leve e bastante popular. Sua utilização se deu 
principalmente devido a facilidade de se manipular as informações do mapa. Por exemplo, quando o usuário insere no campo o
seu bairro, o mapa precisa se atualizar e redirecionar para o local desejado.

#### Bootstrap
Além do Vue.js, usamos Bootstrap como biblioteca de css para fazer a parte "estética" do site. Porém, não foi despendido muito 
tempo de desenvolvimento nesse aspecto, cabendo ainda muito espaço para melhorias.

### Ferramentas extras

#### OpenCage
Por fora, usamos a API do [OpenCage](https://opencagedata.com/api) para fazer o geocoding.

#### Heroku
Por fim, o site foi deployado no serviço gratuito do heroku, que é suficiente para projetos pequenos e sem muita demanda de
processamento. O site está disponível [aqui](https://rio-masks.herokuapp.com/).

## Funcionamento técnico do projeto

O Fluxo de uso de um usuário ao entrar no site é se deparar direto com o mapa, focado na região metropolitana do Rio de 
Janeiro. Logo acima do mapa, existe um campo onde a pessoa pode pesquisar por uma localização (Bairro, rua, sub-bairro).
Ao fazer isso, ele vai mandar uma requisição pro nosso servidor, que vai pegar o texto digitado, e enviar pra API do 
OpenCage, que retornará as coordenadas da localização requisitada. Essas cordenadas são enviadas de volta para o site, 
e o mapa se redireciona para essas coordenadas.

No mapa, o usuário verá pontos vermelhos, que representam os vendedores de máscaras. Ao dar zoom, jalenas com informações 
sobre esses vendedores aparecerão perto de cada bolinha no mapa (contato, preço e nome).

Caso o usuário seja vendedor e queira cadastrar sua loja, existe o campo em baixo do mapa feito para isso. Nesse campo, ele 
preencherá as informações e será enviado para o nosso servidor uma requisição. O server por sua vez gera um email e envia
para o dono do site uma mensagem com as informações do formulário para que a checagem manual seja feita e que possamos entrar
em contato com o artesão para conferir as mesmas.

No servidor, existe [um arquivo tipo JSON com todas as informações de lojas já cadastradas](https://github.com/guimafelipe/rio-masks-server-api/blob/master/server/api/mapinfo.json).
Esse arquivo pode ser preenchido com as informações **seguindo o mesmo modelo mostrado no mesmo**. O campo das coordenadas 
não precisa ser preenchido. Quando um usuário entra no site, é enviado para o servidor um pedido das informações dos vendedores.
O nosso programa lê esse arquivo JSON, e para as lojas que não tem a coordenada definida, ele pega o endereço escrito e envia
para o OpenCage uma requisição com este endereço, e obtém as coordenadas da mesma e substutui no arquivo.
Por fim, envia os dados corretamente e o arquivo fica salvo no servidor com todas as coordenadas já cadastradas.

> Observação: O serviço de Geocoding não é gratuito. É limitado em 2500 chamadas de API por mês, depois disso tem que pagar.
Outros serviços existem disponíveis, como o do Google por exemplo. Mas nenhum deles é gratuito. Então, quanto menos chamadas
a gente fizer pra esse serviço, melhor.
> 
> O arquivo JSON atualizado com as coordenadas é fácil de se conseguir usando o console do heroku no site. Então a gente pode 
pegar a versão atualizada com as coordenadas da loja e já usar na próxima atualização manual, reduzindo bastante a quantidade
de chamadas à API de GeoCoding.  


Para atualizar o arquivo, a gente só precisa atualizar ele aqui no github, e depois atualizar no heroku. O heroku vai ver os 
arquivos aqui no github e usá-los para rodar o site no servidor deles.

## Alternativas

Existem outras tecnologias que poderiam ser usadas para o projeto e foram consideradas por mim também. Vou citá-las nessa
sessão.

### Wix, wordpress e derivados

Esses serviços oferecem uma boa estrutura pra se montar sites bonitos sem muito esforço, porém, não sei como seria a liberdade
que teríamos para mexer no código javascript desses serviços para fazer a manipulação do site. Isso não significa que não
possamos mudar o projeto para uma dessas plataformas, mas como era um projeto pequeno eu acabei optando por ter liberdade
de construí-lo de um jeito que dê pra saber tudo que está acontecendo.
Acho que o mais importante é a API de backend, que de fato disponibiliza as informações de lojistas pro nosso front-end. É
possível que a gente consiga usar essa API ainda mesmo usando serviços como o Wix e Wordpress.

### Outros frameworks de backend

como disse acima, dava pra usar PHP, Ruby, Python e etc para fazer a API que disponibiliza a informação das lojas cadastradas. E na minha opinião, não faria muita diferença. Optei por node por ser bem leve e fácil de subir para serviços
de hospedagem como o heroku. Além de ser bem difícil dar problema com dependências de bibliotecas. Então dá pra baixar o projeto em qualquer computador e trabalhar nele normalmente.

### Outros serviços de GeoCoding

Como disse, o serviço de GeoCoding é bem limitado. O que esse serviço faz basicamente é receber um texto (Rua Coroados, Senador Camará, Rio de janeiro por exemplo), e retornar as coordenadas dessa localização no mapa.
Vale a pena pesquisar outros serviços e achar o mais barato, mas dentre os que eu vi, o OpenCage foi o mais atraente pro nosso uso.

### Uso de Banco de Dados

Uma alternativa a deixar as informações dos lojistas num arquivo JSON, é popular um banco de dados (MongoDB por exemplo) e
deixar as informações nesse banco. O problema é que talvez fique mais difícil mudar as informações por pessoas que são leigas
em computação. A alternativa mais viável é deixar o banco em um repositório e servidor gratuito de banco de dados (MongoLabs por exemplo) e ir atualizando manualmente pela interface deles.

## To Do list

Por fim, algumas coisas que ainda faltam fazer no projeto depois desse protótipo:

- Popular com dados de lojistas.
- Deixar o site mais bonito:
  - Melhorar o acabamento do CSS
  - Melhorar as informações do site
  - Melhorar as animações do mapa
  - Ajustar quando mostrar as informações da loja
  - Melhorar cores e acabamento no geral (css)
- Melhorar os forms de contato do lojista
- Aumentar a segurança (já que um logista pode spammar emails pra gente preenchendo o formulário repetidas vezes)
- Tentar limitar o uso de Geocoding e suas alternativas











