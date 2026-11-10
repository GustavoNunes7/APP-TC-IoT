
// Importa o React
import React from "react";

// Stack controla a navegação entre telas
import { Stack } from "expo-router";

// StatusBar controla a barra superior do celular
import { StatusBar } from "expo-status-bar";

// Importa as cores oficiais do TechCampus
import colors from "../constants/colors";

// Layout principal do aplicativo
export default function RootLayout() {
  return (
    <>
      {/* Define a aparência da barra de status do celular */}
      <StatusBar
        style="light"
        backgroundColor={colors.background}
      />

      {/* Configuração da navegação do aplicativo */}
      <Stack
        screenOptions={{
          // Cor de fundo padrão de todas as telas
          contentStyle: {
            backgroundColor: colors.background,
          },

          // Esconde o cabeçalho padrão do Expo
          // Assim podemos criar nosso próprio cabeçalho
          headerShown: false,

          // Cor utilizada nas transições de navegação
          animation: "slide_from_right",
        }}
      >
        {/* Tela inicial do aplicativo */}
        <Stack.Screen
          name="index"
          options={{
            title: "TechCampus IoT",
          }}
        />

        {/* Tela responsável pela validação do token */}
        <Stack.Screen
          name="validar-token"
          options={{
            title: "Validar Token",
          }}
        />

        {/* Tela que apresenta o status do dispositivo */}
        <Stack.Screen
          name="status"
          options={{
            title: "Status do dispositivo",
          }}
        />
      </Stack>
    </>
  );
}
