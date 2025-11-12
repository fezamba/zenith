package br.com.unirio.marketplace.zenith.dto;

import br.com.unirio.marketplace.zenith.model.Pedido;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class PedidoDTO {
    
    private Integer id;
    private Integer clienteId;
    private Integer enderecoId;
    private LocalDate data;
    private BigDecimal valorTotal;
    private String status;
    private List<ItemPedidoDTO> itens;

    public PedidoDTO(Pedido pedido) {
        this.id = pedido.getId();
        this.clienteId = pedido.getCliente().getId();
        this.enderecoId = pedido.getEnderecoEntrega().getId();
        this.data = pedido.getData();
        this.valorTotal = pedido.getValorTotal();
        this.status = pedido.getStatus();
        this.itens = pedido.getItens().stream()
                .map(ItemPedidoDTO::new)
                .collect(Collectors.toList());
    }
}