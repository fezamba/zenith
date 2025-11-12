package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    
    List<Pedido> findByClienteId(Integer clienteId);

    @Query("""
        select case when count(p) > 0 then true else false end
        from Pedido p
            join p.itens i
        where p.cliente.id = :clienteId
          and i.produto.id = :produtoId
          and p.status = 'ENTREGUE'
    """)
    boolean clienteComprouERecebeu(Integer clienteId, Integer produtoId);
}
