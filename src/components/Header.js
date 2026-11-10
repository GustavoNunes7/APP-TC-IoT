
// Importa o React
import React from "react";

// Componentes do React Native
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// Navegação do Expo Router
import { router } from "expo-router";

// Cores do TechCampus
import colors from "../constants/colors";

// Componente reutilizável de cabeçalho
export default function Header({

  // Texto principal do cabeçalho
  title = "TechCampus",

  // Texto secundário
  subtitle = "SISTEMA IoT",

  // Define se o botão de voltar será exibido
  showBack = false,

}) {

  return (

    <View style={styles.container}>

      {/* Área superior do cabeçalho */}
      <View style={styles.topRow}>

        {/* Botão de voltar */}
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </TouchableOpacity>
        )}

        {/* Nome do sistema */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>

        {/* Identificação visual TC */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>
            TC
          </Text>
        </View>

      </View>

      {/* Linha vermelha decorativa */}
      <View style={styles.separator} />

    </View>
  );
}

// Estilização do componente
const styles = StyleSheet.create({

  // Estrutura principal
  container: {
    width: "100%",
    marginBottom: 25,
  },

  // Organiza os elementos horizontalmente
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Área dos textos
  titleContainer: {
    flex: 1,
  },

  // Título
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },

  // Subtítulo
  subtitle: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    marginTop: 5,
  },

  // Logo
  logo: {
    width: 43,
    height: 43,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "bold",
  },

  // Botão de voltar
  backButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },

  backText: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 32,
  },

  // Linha inferior
  separator: {
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 18,
    borderRadius: 2,
    width: 45,
  },

});
