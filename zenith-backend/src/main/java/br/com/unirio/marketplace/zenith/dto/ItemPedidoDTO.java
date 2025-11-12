package br.com.unirio.marketplace.zenith.dto;

import br.com.unirio.marketplace.zenith.model.ItemPedido;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemPedidoDTO {

    private Integer produtoId;
    private String nomeProduto;
    private int quantidade;
    private BigDecimal precoUnitario;

    public ItemPedidoDTO(ItemPedido itemPedido) {
        this.produtoId = itemPedido.getProduto().getId();
        this.nomeProduto = itemPedido.getProduto().getNome();
        this.quantidade = itemPedido.getQuantidade();
        this.precoUnitario = itemPedido.getPrecoUnitario();
    }
}