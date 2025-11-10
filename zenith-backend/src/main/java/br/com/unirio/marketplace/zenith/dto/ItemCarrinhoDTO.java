package br.com.unirio.marketplace.zenith.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;

@Data
public class ItemCarrinhoDTO {
    private Integer produtoId;
    private String nomeProduto;
    private int quantidade;
    private BigDecimal precoUnitario;
    private Instant dataAdicionado;
}