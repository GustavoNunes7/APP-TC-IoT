# TechCampus IoT

Aplicativo mobile do **TechCampus**, projeto de retirada inteligente da AAPM/SENAI. O aluno informa o token numérico recebido após a confirmação do pedido, e o aplicativo consulta o backend TechCampus para validar esse código.

O aplicativo foi desenvolvido com **React Native**, **Expo** e **Expo Router**.

## Funcionalidades

- Tela inicial para digitação do token de retirada.
- Validação de token numérico com 6 dígitos.
- Comunicação HTTP com a API do TechCampus.
- Tela de resultado da validação.
- Verificação da disponibilidade do servidor.
- Interface com a identidade visual do TechCampus (vermelho, preto e branco).

> **Importante:** o aplicativo e o backend são projetos separados. Para validar tokens, o servidor TechCampus precisa estar em execução. A comunicação com o ESP8266, o acionamento do LED e a confirmação física da retirada ainda dependem da integração do dispositivo com o backend.

## Tecnologias

- React Native
- Expo SDK
- Expo Router
- JavaScript
- Fetch API

## Requisitos

- Node.js e npm instalados.
- Backend **TechCampus** configurado e em execução.
- Android Studio Emulator ou celular Android com Expo Go.
- Para celular físico, computador e celular conectados à mesma rede Wi-Fi.

## Instalação

1. Clone este repositório ou baixe os arquivos.
2. Abra o terminal na pasta `APP-TC-IoT`.
3. Instale as dependências:

   ```bash
   npm install
   ```

## Configuração da conexão com o backend

O endereço da API é configurado em `src/services/api.js` pela variável `EXPO_PUBLIC_API_URL`.

### Android Studio Emulator

Por padrão, o aplicativo utiliza:

```text
http://10.0.2.2:3001
```

O endereço `10.0.2.2` permite que o emulador Android acesse o computador que está executando o backend.

Se o TechCampus estiver usando outra porta, crie ou edite o arquivo `.env` na raiz deste aplicativo. Por exemplo, para a porta `3022`:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3022
```

### Celular físico

1. Descubra o endereço IPv4 do computador. No Windows, execute:

   ```powershell
   ipconfig
   ```

2. Procure o endereço IPv4 do adaptador Wi-Fi.
3. No arquivo `.env`, informe o IP do computador e a porta utilizada pelo backend. Exemplo:

   ```env
   EXPO_PUBLIC_API_URL=http://192.168.0.100:3001
   ```

   Substitua `192.168.0.100` pelo endereço IPv4 real do computador.

4. Deixe o celular e o computador na mesma rede Wi-Fi.
5. Verifique se o firewall do Windows permite a conexão na porta do servidor.

> Não use `localhost` ou `127.0.0.1` no celular físico: esses endereços apontam para o próprio celular. No emulador Android, use `10.0.2.2`.

Sempre que alterar o arquivo `.env`, reinicie o Expo para carregar a nova variável.


## Executar no Linux Mint (notebook + celular físico)

Este procedimento foi preparado para executar o backend TechCampus no notebook Linux Mint e abrir o aplicativo no celular pela mesma rede Wi-Fi.

### 1. Conectar notebook e celular

1. Conecte o notebook Linux Mint à rede Wi-Fi.
2. Conecte o celular à mesma rede.
3. Mantenha os dois dispositivos na mesma rede local durante os testes.

### 2. Iniciar o backend TechCampus

Abra um terminal e entre na pasta do projeto principal:

```bash
cd ~/Secretária/TechCampus
```

Execute o inicializador Linux:

```bash
./INICIAR-Linux.sh
```

O backend utilizado pelo aplicativo deve estar disponível na porta `3022`. Mantenha esse terminal aberto enquanto utilizar o aplicativo.

> Se o arquivo não tiver permissão de execução, execute uma vez `chmod +x INICIAR-Linux.sh` e tente novamente.

### 3. Descobrir o IP do notebook

Abra outro terminal e execute:

```bash
hostname -I
```

Identifique o endereço IPv4 da rede Wi-Fi que também está sendo utilizada pelo celular. Por exemplo:

```text
192.168.0.16
```

O IP acima é apenas um exemplo. Utilize o endereço mostrado no seu notebook.

### 4. Configurar o endereço da API no aplicativo

Na pasta raiz deste projeto (`APP-TC-IoT`), crie ou edite o arquivo `.env`:

```bash
xed .env
```

Adicione a variável abaixo, substituindo o IP pelo endereço IPv4 atual do notebook:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.16:3022
```

Salve o arquivo. Não utilize `localhost` nem `127.0.0.1` para um celular físico, pois esses endereços apontam para o próprio celular.

> O endereço IP pode mudar ao trocar de rede ou reconectar o notebook. Se isso acontecer, execute novamente `hostname -I` e atualize o valor no arquivo `.env`.

### 5. Testar a API pelo celular

Antes de abrir o aplicativo, utilize o navegador do celular para acessar:

```text
http://IP_DO_NOTEBOOK:3022/api/saude
```

Exemplo:

```text
http://192.168.0.16:3022/api/saude
```

Se a API responder indicando que está online, o celular conseguiu alcançar o backend pela rede local.

Se não responder, confira se:
- o backend continua em execução na porta `3022`;
- o celular e o notebook estão na mesma rede Wi-Fi;
- o IP informado está correto;
- o firewall do Linux Mint não está bloqueando a porta do servidor.

### 6. Iniciar o Expo

Abra um segundo terminal na pasta do aplicativo:

```bash
cd ~/Secretária/APP-TC-IoT
```

Inicie o Expo limpando o cache para carregar a configuração atualizada:

```bash
npx expo start -c
```

Aguarde o QR Code. No celular, abra o Expo Go e escaneie o código para carregar o aplicativo.

O Expo utiliza normalmente a porta `8081` para servir o aplicativo durante o desenvolvimento. Essa porta é diferente da porta `3022`, utilizada pelo backend TechCampus.

Se o celular não conseguir carregar o projeto pela rede local, pode-se testar:

```bash
npx expo start --tunnel
```

O modo Tunnel ajuda a carregar o projeto Expo em algumas redes restritivas, mas não substitui a conexão do aplicativo com o backend na porta `3022`.

### 7. Verificar a integração

Com o aplicativo aberto:

1. Confira se o status do servidor aparece como online.
2. Teste o acesso às funcionalidades disponíveis.
3. Teste a validação de um token de teste autorizado pelo backend.
4. Confirme separadamente a integração física com o ESP8266, quando estiver disponível.

A resposta positiva de `/api/saude` confirma apenas que o backend está acessível; não comprova, sozinha, que a validação de token ou o dispositivo IoT estejam funcionando.

### Checklist antes da demonstração no Linux Mint

- [ ] Notebook e celular conectados à mesma rede Wi-Fi.
- [ ] Backend TechCampus iniciado na porta `3022`.
- [ ] IP atual do notebook identificado com `hostname -I`.
- [ ] `.env` do aplicativo configurado com `EXPO_PUBLIC_API_URL`.
- [ ] Endpoint `/api/saude` acessível pelo navegador do celular.
- [ ] Expo iniciado com `npx expo start -c`.
- [ ] Aplicativo aberto pelo Expo Go.
- [ ] Login e funcionalidades principais testados.
- [ ] Integração IoT testada separadamente.

Mantenha os terminais do backend e do Expo abertos durante a demonstração.

## Executar o aplicativo

Com as dependências instaladas, execute:

```bash
npx expo start
```

Para abrir no Android Studio Emulator, pressione `a` no terminal do Expo.

Também é possível utilizar:

```bash
npm run android
```

Para limpar o cache do Metro e iniciar novamente:

```bash
npx expo start -c
```

## Executar o backend TechCampus

O backend não está incluído neste repositório. Ele deve ser iniciado separadamente, na pasta do projeto principal **TechCampus**.

Confira a porta configurada no backend antes de iniciar o aplicativo. O servidor utiliza a porta definida em `PORT` no arquivo `.env`; quando não há configuração, a porta padrão do código é `3001`.

Antes de testar o aplicativo, confirme que o backend está funcionando e que o endereço configurado em `EXPO_PUBLIC_API_URL` corresponde à porta correta.

### Rotas utilizadas

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/api/saude` | Verificar se a API está online |
| `POST` | `/api/iot/validar` | Validar o token de retirada |

A validação envia um JSON no formato:

```json
{
  "token": "123456"
}
```

O token deve conter exatamente 6 números. A resposta de sucesso do backend inclui o campo `valido` e informações relacionadas ao pedido, como `pedidoId`, `produtos` e `expiraEm`.

## Estrutura do projeto

```text
APP-TC-IoT/
├── src/
│   ├── app/
│   │   ├── _layout.js
│   │   ├── index.js
│   │   ├── validar-token.js
│   │   └── status.js
│   ├── components/
│   │   ├── Header.js
│   │   ├── PrimaryButton.js
│   │   ├── StatusCard.js
│   │   └── TokenInput.js
│   ├── constants/
│   │   └── colors.js
│   ├── hooks/
│   │   └── useConnection.js
│   └── services/
│       ├── api.js
│       ├── deviceService.js
│       └── tokenService.js
├── app.json
├── package.json
└── README.md
```

## Solução de problemas

### O aplicativo não conecta ao servidor

- Confirme se o backend TechCampus está em execução.
- Confira se a porta no endereço `EXPO_PUBLIC_API_URL` é a mesma utilizada pelo backend.
- No Android Studio Emulator, use `10.0.2.2` no lugar de `localhost`.
- No celular físico, use o IPv4 do computador e a mesma rede Wi-Fi.
- Verifique as permissões do firewall do Windows.
- Depois de alterar o `.env`, reinicie com `npx expo start -c`.

### Erro ao instalar dependências

Na pasta do aplicativo, tente:

```bash
npm install
```

Se o erro persistir, confira a versão do Node.js (`node -v`) e a mensagem completa apresentada pelo npm antes de alterar as versões das dependências.

### A API está online, mas o ESP8266 não responde

A verificação de saúde confirma apenas que o backend está acessível. Ela **não comprova** que o ESP8266 está conectado, que o LED foi acionado ou que o mecanismo de retirada foi liberado. Esses estados precisam ser enviados pelo dispositivo ao backend e disponibilizados por uma integração própria.

## Projeto

**TechCampus IoT — AAPM / SENAI**

Aplicativo complementar ao sistema TechCampus para apoiar o processo de retirada inteligente de produtos.
