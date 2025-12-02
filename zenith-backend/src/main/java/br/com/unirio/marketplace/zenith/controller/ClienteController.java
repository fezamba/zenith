package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.ClienteDTO;
import br.com.unirio.marketplace.zenith.model.Cliente;
import br.com.unirio.marketplace.zenith.repository.ClienteRepository;
import br.com.unirio.marketplace.zenith.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<ClienteDTO> getMeusDados(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Cliente cliente = clienteRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        return ResponseEntity.ok(new ClienteDTO(cliente));
    }
}