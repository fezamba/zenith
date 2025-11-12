package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.dto.CarrinhoDTO;
import br.com.unirio.marketplace.zenith.dto.ItemCarrinhoDTO;
import br.com.unirio.marketplace.zenith.exception.EstoqueInsuficienteException;
import br.com.unirio.marketplace.zenith.exception.ResourceNotFoundException;
import br.com.unirio.marketplace.zenith.model.Produto;
import br.com.unirio.marketplace.zenith.model.mongo.Carrinho;
import br.com.unirio.marketplace.zenith.model.mongo.Item;
import br.com.unirio.marketplace.zenith.repository.CarrinhoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarrinhoService {

    private final CarrinhoRepository carrinhoRepository;
    private final ProdutoService produtoService;

    public CarrinhoService(CarrinhoRepository carrinhoRepository, ProdutoService produtoService) {
        this.carrinhoRepository = carrinhoRepository;
        this.produtoService = produtoService;
    }

    public CarrinhoDTO buscarCarrinho(Integer usuarioId) {
        Carrinho carrinho = carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> criarCarrinhoVazio(usuarioId));

        return mapCarrinhoToDTO(carrinho);
    }

    public CarrinhoDTO adicionarAoCarrinho(Integer usuarioId, Integer produtoId, int quantidade) {
        Produto produto = produtoService.findProdutoByIdInterno(produtoId);

        Carrinho carrinho = carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> criarCarrinhoVazio(usuarioId));

        if (carrinho.getItens() == null) {
            carrinho.setItens(new ArrayList<>());
        }

        Optional<Item> itemExistente = carrinho.getItens().stream()
                .filter(item -> item.getProdutoId().equals(produtoId))
                .findFirst();

        int novaQuantidadeTotal = quantidade;
        if (itemExistente.isPresent()) {
            novaQuantidadeTotal += itemExistente.get().getQuantidade();
        }

        if (produto.getEstoque() < novaQuantidadeTotal) {
            throw new EstoqueInsuficienteException("Estoque insuficiente para o produto: " + produto.getNome() + ". Em estoque: " + produto.getEstoque());
        }

        if (itemExistente.isPresent()) {
            Item item = itemExistente.get();
            item.setQuantidade(novaQuantidadeTotal);
            item.setDataAdicionado(Instant.now());
        } else {
            Item novoItem = new Item();
            novoItem.setProdutoId(produtoId);
            novoItem.setQuantidade(quantidade);
            novoItem.setDataAdicionado(Instant.now());
            carrinho.getItens().add(novoItem);
        }

        carrinho.setDataModificado(Instant.now());
        Carrinho carrinhoSalvo = carrinhoRepository.save(carrinho);
        return mapCarrinhoToDTO(carrinhoSalvo);
    }

    public CarrinhoDTO atualizarQuantidade(Integer usuarioId, Integer produtoId, int novaQuantidade) {
        if (novaQuantidade == 0) {
            return removerDoCarrinho(usuarioId, produtoId);
        }

        Produto produto = produtoService.findProdutoByIdInterno(produtoId);

        if (produto.getEstoque() < novaQuantidade) {
            throw new EstoqueInsuficienteException("Estoque insuficiente para o produto: " + produto.getNome() + ". Em estoque: " + produto.getEstoque());
        }

        Carrinho carrinho = buscarCarrinhoEntidade(usuarioId);

        carrinho.getItens().stream()
                .filter(item -> item.getProdutoId().equals(produtoId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantidade(novaQuantidade);
                    item.setDataAdicionado(Instant.now());
                });
        
        carrinho.setDataModificado(Instant.now());
        Carrinho carrinhoSalvo = carrinhoRepository.save(carrinho);
        return mapCarrinhoToDTO(carrinhoSalvo);
    }

    public CarrinhoDTO removerDoCarrinho(Integer usuarioId, Integer produtoId) {
        Carrinho carrinho = buscarCarrinhoEntidade(usuarioId);

        boolean removido = carrinho.getItens().removeIf(item -> item.getProdutoId().equals(produtoId));

        if (removido) {
            carrinho.setDataModificado(Instant.now());
            Carrinho carrinhoSalvo = carrinhoRepository.save(carrinho);
            return mapCarrinhoToDTO(carrinhoSalvo);
        }
        
        return mapCarrinhoToDTO(carrinho);
    }


    private Carrinho buscarCarrinhoEntidade(Integer usuarioId) {
        return carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> criarCarrinhoVazio(usuarioId));
    }

    private Carrinho criarCarrinhoVazio(Integer usuarioId) {
        Carrinho carrinho = new Carrinho();
        carrinho.setUsuarioId(usuarioId);
        carrinho.setItens(new ArrayList<>());
        carrinho.setDataModificado(Instant.now());
        return carrinhoRepository.save(carrinho);
    }

    private CarrinhoDTO mapCarrinhoToDTO(Carrinho carrinho) {
        CarrinhoDTO dto = new CarrinhoDTO();
        dto.setId(carrinho.getId());
        dto.setUsuarioId(carrinho.getUsuarioId());
        dto.setDataModificado(carrinho.getDataModificado());

        if (carrinho.getItens() == null) {
            carrinho.setItens(new ArrayList<>());
        }

        List<ItemCarrinhoDTO> itensDTO = carrinho.getItens().stream().map(itemMongo -> {
            Produto produto;
            try {
                produto = produtoService.findProdutoByIdInterno(itemMongo.getProdutoId());
            } catch (ResourceNotFoundException e) {
                return null;
            }

            ItemCarrinhoDTO itemDTO = new ItemCarrinhoDTO();
            itemDTO.setProdutoId(itemMongo.getProdutoId());
            itemDTO.setQuantidade(itemMongo.getQuantidade());
            itemDTO.setDataAdicionado(itemMongo.getDataAdicionado());
            itemDTO.setNomeProduto(produto.getNome());
            itemDTO.setPrecoUnitario(produto.getPreco());

            return itemDTO;

        }).filter(Objects::nonNull)
        .collect(Collectors.toList());

        BigDecimal subtotal = itensDTO.stream()
                .map(itemDTO -> itemDTO.getPrecoUnitario().multiply(BigDecimal.valueOf(itemDTO.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setItens(itensDTO);
        dto.setSubtotal(subtotal);

        return dto;
    }
}