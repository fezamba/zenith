package br.com.unirio.marketplace.zenith.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AtualizarQtdInputDTO {

    @NotNull(message = "O ID do produto é obrigatório")
    private Integer produtoId;

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 0, message = "A quantidade não pode ser negativa")
    private int quantidade;
}