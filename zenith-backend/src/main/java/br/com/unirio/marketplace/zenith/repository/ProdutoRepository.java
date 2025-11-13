package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer>, JpaSpecificationExecutor<Produto> { 

    List<Produto> findByVendedorId(Integer vendedorId);

    List<Produto> findByCategoriaId(Integer categoriaId);

    List<Produto> findByNomeContainingIgnoreCase(String nome);

    List<Produto> findByStatusSelo(String statusSelo);
}