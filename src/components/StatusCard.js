
// Importa o React
import React from "react";

// Componentes do React Native
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

// Importa as cores do TechCampus
import colors from "../constants/colors";

// Componente de botão reutilizável
export default function PrimaryButton({

  // Texto exibido no botão
  title = "CONTINUAR",

  // Função executada ao clicar
  onPress,

  // Indica se o botão está carregando
  loading = false,

  // Impede o clique quando necessário
  disabled = false,

  // Permite personalizar a largura
  fullWidth = true,

}) {

  // Verifica se o botão deve ficar desativado
  const isDisabled = disabled || loading;

  return (

    <TouchableOpacity

      // Aplica os estilos do botão
      style={[
        styles.button,

        // Ocupa toda a largura disponível, por padrão
        fullWidth && styles.fullWidth,

        // Altera a aparência quando desativado
        isDisabled && styles.disabled,
      ]}

      // Função executada ao clicar
      onPress={onPress}

      // Impede cliques durante o carregamento
      disabled={isDisabled}

      // Efeito visual ao pressionar
      activeOpacity={0.8}
    >

      {/* Mostra carregamento ou texto */}
      {loading ? (

        // Indicador de carregamento
        <ActivityIndicator
          color={colors.white}
          size="small"
        />

      ) : (

        // Texto do botão
        <Text style={styles.buttonText}>
          {title}
        </Text>

      )}

    </TouchableOpacity>
  );
}

// Estilização do botão
const styles = StyleSheet.create({

  // Estrutura principal
  button: {
    height: 55,
    backgroundColor: colors.primary,
    borderRadius: 10,

    // Centraliza o conteúdo
    justifyContent: "center",
    alignItems: "center",

    // Espaçamento interno
    paddingHorizontal: 20,
  },

  // Ocupa toda a largura disponível
  fullWidth: {
    width: "100%",
  },

  // Texto
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // Aparência quando desativado
  disabled: {
    opacity: 0.5,
  },

});
