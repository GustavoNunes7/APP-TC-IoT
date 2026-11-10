# Gerando builds do app com EAS Build (Expo) — Android e iOS

Guia rápido para gerar builds instaláveis do projeto React Native/Expo nas duas plataformas.

## Pré-requisitos

- Node.js instalado
- Projeto Expo já criado
- Terminal aberto na pasta do projeto
- Para iOS: uma conta Apple (gratuita serve para build de teste; conta paga de desenvolvedor só é exigida para publicar na App Store)

## Passo a passo comum (Android e iOS)

### 1. Fazer login na Expo

```bash
npx eas-cli login
```

Usar `npx eas-cli` (em vez de instalar o `eas-cli` globalmente com `npm install -g`) evita erros comuns de permissão e de versão global desatualizada — o `npx` baixa e roda a versão certa na hora, sem precisar instalar nada fixo na máquina.

Se ainda não tiver conta, crie uma gratuitamente em [expo.dev](https://expo.dev) — ela é necessária para usar o serviço de build na nuvem.

### 2. Configurar o build

```bash
npx eas-cli build:configure
```

Cria o arquivo `eas.json` na raiz do projeto, com os perfis `development`, `preview` e `production`. Só precisa rodar uma vez. Nesse passo o EAS pode perguntar quais plataformas você quer configurar — escolha **Android e iOS**.

---

## Android — gerar um `.apk`

Por padrão, o Expo gera um `.aab` (formato exigido pela Play Store). Para gerar um `.apk` instalável direto no celular, edite **apenas** o perfil `preview` do `eas.json`, adicionando a chave `"android"`:

```json
{
  "cli": {
    "version": ">= 24.3.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

> ⚠️ **Atenção:** edite o `eas.json` existente — não crie um novo do zero nem cole apenas o bloco `"preview"` isolado. Se apagar `cli`, `development`, `production` ou `submit`, o build pode falhar ou usar configurações erradas.

Rodar o build:

```bash
npx eas-cli build --platform android --profile preview
```

Leva geralmente entre 5 e 15 minutos. Ao terminar, o terminal mostra um link de download (também disponível em `expo.dev/accounts/[sua-conta]/projects`).

- Abra o link direto no navegador do celular para baixar e instalar, **ou**
- Baixe no computador e transfira para o aparelho.

No Android, pode ser necessário habilitar **"Instalar apps de fontes desconhecidas"** para instalar o `.apk` manualmente.

---

## iOS — gerar um build de teste

No iPhone não existe um equivalente ao `.apk` que se instale livremente: a Apple exige que o app seja assinado e instalado por um canal autorizado. Para testes, o mais simples é usar o **TestFlight** (ferramenta oficial da Apple).

O perfil `preview` do `eas.json` já criado serve para isso, sem precisar de ajustes:

```json
"preview": {
  "distribution": "internal"
}
```

Rodar o build:

```bash
npx eas-cli build --platform ios --profile preview
```

Na primeira vez, o EAS pergunta se você quer que ele gerencie as credenciais da Apple (certificados e provisioning profile) automaticamente — responda **sim**, e faça login com o Apple ID quando solicitado. Isso evita ter que mexer manualmente no Apple Developer portal.

Depois do build pronto:

```bash
npx eas-cli submit --platform ios --profile preview
```

Esse comando envia o build para o **TestFlight**. Em alguns minutos ele aparece disponível para os dispositivos cadastrados, e quem for testar instala pelo app TestFlight no iPhone.

> 💡 Build de teste via TestFlight funciona mesmo com conta Apple gratuita, mas o número de convites e a validade do build são mais limitados do que com a conta paga de desenvolvedor (US$ 99/ano).

---

## Rodar os dois builds de uma vez

```bash
npx eas-cli build --platform all --profile preview
```

O EAS enfileira o build de Android e de iOS juntos.

---

## Solução de problemas

### Erro: `no member named 'executeSync' in 'worklets::WorkletRuntime'`

Se o build falhar na fase **"Run gradlew"** (Android) com um erro parecido com:

```
error: no member named 'executeSync' in 'worklets::WorkletRuntime'
    workletRuntime->executeSync([func = std::move(func)](jsi::Runtime &rt) -> jsi::Value {
```

É um conflito de versões entre `react-native-worklets` e `expo-modules-core` no Expo SDK 57. O `react-native-reanimated` mais recente instala uma versão do `worklets` (0.12.x) ainda não suportada pelo `expo-modules-core` (que aceita até 0.10.x).

**Confirmar o problema:**

```bash
npm ls react-native-worklets react-native-reanimated expo-modules-core
```

Se aparecer `invalid: "^0.7.4 || ^0.8.0 || ^0.9.0 || ^0.10.0"` ao lado do `react-native-worklets`, é esse o problema.

**Corrigir:**

```bash
npm install react-native-reanimated@4.5.5 react-native-worklets@0.10.4
```

Confirme que o conflito sumiu:

```bash
npm ls react-native-worklets react-native-reanimated expo-modules-core
```

Depois, gere o build novamente limpando o cache:

```bash
npx eas-cli build --platform android --profile preview --clear-cache
```

> 💡 Esse é um problema conhecido do Expo SDK 57. Se uma atualização futura corrigir a compatibilidade, `npx expo install --fix` pode passar a resolver automaticamente — até lá, o ajuste manual acima é necessário.

## Perguntas frequentes

**É gratuito?**
Sim, para Android. A Expo oferece uma cota gratuita mensal de builds na nuvem, suficiente para uso educacional. Para iOS, o build em si também usa essa cota gratuita, mas testar via TestFlight com muitos usuários por muito tempo pode exigir a conta paga de desenvolvedor Apple.

**Precisa de conta na Google Play ou App Store?**
Não. Isso só é necessário para publicar o app de verdade nas lojas. Para testar — `.apk` no Android ou TestFlight no iOS — a conta Expo (e Apple gratuita) já é suficiente.

**Qual a diferença entre `.apk` e `.aab`?**
- `.aab` (*Android App Bundle*): formato exigido pela Play Store, que gera os APKs otimizados para cada dispositivo.
- `.apk`: instalável direto, ideal para testar no celular sem passar pela loja.

**Existe uma alternativa sem usar a nuvem?**

Android:
```bash
npx expo prebuild
cd android
./gradlew assembleRelease
```

iOS (exige um Mac com Xcode instalado):
```bash
npx expo prebuild
cd ios
xcodebuild -workspace *.xcworkspace -scheme "SeuApp" -configuration Release
```

Ambos exigem ferramentas extras instaladas na máquina (Android Studio/JDK ou Xcode) — mais trabalhoso de configurar, então o EAS Build costuma ser a opção mais simples, principalmente em sala de aula.