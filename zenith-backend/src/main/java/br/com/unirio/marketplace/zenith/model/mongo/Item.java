package br.com.unirio.marketplace.zenith.model.mongo;

import java.time.Instant;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data 
public class Item {
    @Field("produto_id")
    private Integer produtoId;
    private int quantidade;
    @Field("data_adicionado")
    private Instant dataAdicionado;
}