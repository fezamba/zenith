package br.com.unirio.marketplace.zenith.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class CarrinhoDTO {

    private String id;
    private Integer usuarioId;
    private Instant dataModificado;
    private List<ItemCarrinhoDTO> itens;
    private BigDecimal subtotal;
}