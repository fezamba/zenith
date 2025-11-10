package br.com.unirio.marketplace.zenith.model.embedded;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedidoId implements Serializable {

    private Integer pedidoId;
    private Integer produtoId;

}