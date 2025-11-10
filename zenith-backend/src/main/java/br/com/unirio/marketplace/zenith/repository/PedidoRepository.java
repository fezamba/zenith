package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    
    List<Pedido> findByClienteUsuarioId(Integer clienteId);
}