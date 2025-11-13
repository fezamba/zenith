package br.com.unirio.marketplace.zenith.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AtualizarStatusSeloDTO {

    @NotBlank(message = "O novo status é obrigatório")
    @Pattern(regexp = "APROVADO|REJEITADO", message = "O status deve ser 'APROVADO' ou 'REJEITADO'")
    private String novoStatus;
}