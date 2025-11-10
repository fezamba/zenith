package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.ItemPedido;
import br.com.unirio.marketplace.zenith.model.embedded.ItemPedidoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, ItemPedidoId> {
    
    List<ItemPedido> findByProdutoId(Integer produtoId);
}