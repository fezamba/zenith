package br.com.unirio.marketplace.zenith.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AvaliacaoInputDTO {

    @NotNull(message = "O ID do produto é obrigatório")
    private Integer produtoId;

    @NotNull(message = "A nota é obrigatória")
    @Min(value = 1, message = "A nota deve ser no mínimo 1")
    @Max(value = 5, message = "A nota deve ser no máximo 5")
    private Integer nota;

    @NotBlank(message = "O comentário não pode estar em branco")
    private String comentario;
}