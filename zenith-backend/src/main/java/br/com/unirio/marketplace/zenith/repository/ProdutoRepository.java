package br.com.unirio.marketplace.zenith.repository;

import br.com.unirio.marketplace.zenith.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer>, JpaSpecificationExecutor<Produto> { 

    List<Produto> findByVendedorId(Integer vendedorId);
    List<Produto> findByCategoriaId(Integer categoriaId);
    List<Produto> findByNomeContainingIgnoreCase(String nome);
    List<Produto> findByStatusSelo(String statusSelo);

    @Query(value = "SELECT * FROM produto WHERE MATCH(nome, descricao) AGAINST(:termo IN BOOLEAN MODE) AND status = 'ATIVO'", nativeQuery = true)
    List<Produto> buscarFullText(@Param("termo") String termo);
}