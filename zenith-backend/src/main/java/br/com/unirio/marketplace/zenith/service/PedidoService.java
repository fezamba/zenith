package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.dto.PedidoDTO;
import br.com.unirio.marketplace.zenith.dto.PedidoInputDTO;
import br.com.unirio.marketplace.zenith.exception.EstoqueInsuficienteException;
import br.com.unirio.marketplace.zenith.exception.ResourceNotFoundException;
import br.com.unirio.marketplace.zenith.model.*;
import br.com.unirio.marketplace.zenith.model.embedded.ItemPedidoId;
import br.com.unirio.marketplace.zenith.model.mongo.Carrinho;
import br.com.unirio.marketplace.zenith.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final CarrinhoRepository carrinhoRepository;
    private final ProdutoRepository produtoRepository;
    private final ClienteRepository clienteRepository;
    private final EnderecoRepository enderecoRepository;

    public PedidoService(PedidoRepository pedidoRepository, CarrinhoRepository carrinhoRepository, 
                        ProdutoRepository produtoRepository, ClienteRepository clienteRepository, 
                        EnderecoRepository enderecoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.carrinhoRepository = carrinhoRepository;
        this.produtoRepository = produtoRepository;
        this.clienteRepository = clienteRepository;
        this.enderecoRepository = enderecoRepository;
    }

    @Transactional
    public PedidoDTO criarPedido(Integer usuarioId, PedidoInputDTO pedidoInputDTO) {
        
        Cliente cliente = clienteRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));

        Endereco endereco = enderecoRepository.findById(pedidoInputDTO.getEnderecoId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço não encontrado."));

        if (!endereco.getCliente().getId().equals(usuarioId)) {
            throw new SecurityException("Este endereço não pertence ao usuário autenticado.");
        }

        Carrinho carrinho = carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));
        
        if (carrinho.getItens() == null || carrinho.getItens().isEmpty()) {
            throw new ResourceNotFoundException("O carrinho está vazio.");
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEnderecoEntrega(endereco);
        pedido.setData(LocalDate.now());
        pedido.setStatus("AGUARDANDO_PAGAMENTO");

        List<ItemPedido> itensDoPedido = new ArrayList<>();
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (br.com.unirio.marketplace.zenith.model.mongo.Item itemMongo : carrinho.getItens()) {
            
            Produto produto = produtoRepository.findById(itemMongo.getProdutoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto " + itemMongo.getProdutoId() + " não existe mais."));

            if (produto.getEstoque() < itemMongo.getQuantidade()) {
                throw new EstoqueInsuficienteException("Estoque insuficiente para: " + produto.getNome());
            }

            produto.setEstoque(produto.getEstoque() - itemMongo.getQuantidade());
            
            BigDecimal precoItem = produto.getPreco();
            valorTotal = valorTotal.add(precoItem.multiply(BigDecimal.valueOf(itemMongo.getQuantidade())));

            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setId(new ItemPedidoId(pedido.getId(), produto.getId()));
            itemPedido.setPedido(pedido);
            itemPedido.setProduto(produto);
            itemPedido.setQuantidade(itemMongo.getQuantidade());
            itemPedido.setPrecoUnitario(precoItem);
            
            itensDoPedido.add(itemPedido);
        }

        if (Boolean.TRUE.equals(pedidoInputDTO.getUsarZenithPoints()) && cliente.getZenithPoints() > 0) {
            
            BigDecimal taxaConversao = new BigDecimal("0.01"); 

            BigDecimal descontoMaximo = BigDecimal.valueOf(cliente.getZenithPoints()).multiply(taxaConversao);
            BigDecimal descontoAplicado;

            if (descontoMaximo.compareTo(valorTotal) >= 0) {
                descontoAplicado = valorTotal;
                
                int pontosUsados = valorTotal.divide(taxaConversao, 0, RoundingMode.CEILING).intValue();
                cliente.setZenithPoints(cliente.getZenithPoints() - pontosUsados);
                
            } else {
                descontoAplicado = descontoMaximo;
                cliente.setZenithPoints(0);
            }

            valorTotal = valorTotal.subtract(descontoAplicado);
            
            clienteRepository.save(cliente);
        }

        pedido.setValorTotal(valorTotal);
        pedido.setItens(itensDoPedido);

        Pedido pedidoSalvo = pedidoRepository.save(pedido); 
        carrinhoRepository.delete(carrinho);

        return new PedidoDTO(pedidoSalvo);
    }

    @Transactional(readOnly = true)
    public List<PedidoDTO> listarPedidosPorVendedor(Integer vendedorId) {
        List<Pedido> pedidos = pedidoRepository.findPedidosByVendedorId(vendedorId);
        
        return pedidos.stream()
                .map(PedidoDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public PedidoDTO atualizarStatusPedido(Integer vendedorId, Integer pedidoId, String novoStatus) {
        
        Pedido pedido = pedidoRepository.findPedidoByIdAndVendedorId(pedidoId, vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado ou não pertence a este vendedor."));
        
        pedido.setStatus(novoStatus);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        return new PedidoDTO(pedidoSalvo);
   }
}