package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.PedidoDTO;
import br.com.unirio.marketplace.zenith.dto.PedidoInputDTO;
import br.com.unirio.marketplace.zenith.security.UserDetailsImpl;
import br.com.unirio.marketplace.zenith.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<PedidoDTO> criarPedido(
            Authentication authentication,
            @Valid @RequestBody PedidoInputDTO pedidoInputDTO) {
        
        Integer clienteId = ((UserDetailsImpl) authentication.getPrincipal()).getId();

        PedidoDTO pedidoCriado = pedidoService.criarPedido(
                clienteId,
                pedidoInputDTO
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoCriado);
    }
}