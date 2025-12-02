package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.EnderecoDTO;
import br.com.unirio.marketplace.zenith.security.UserDetailsImpl;
import br.com.unirio.marketplace.zenith.service.EnderecoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @PostMapping
    public ResponseEntity<EnderecoDTO> cadastrarEndereco(
            Authentication authentication,
            @RequestBody EnderecoDTO enderecoDTO) {
        
        Integer clienteId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        EnderecoDTO novoEndereco = enderecoService.cadastrarEndereco(clienteId, enderecoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoEndereco);
    }

    @GetMapping
    public ResponseEntity<List<EnderecoDTO>> listarEnderecos(Authentication authentication) {
        Integer clienteId = ((UserDetailsImpl) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(enderecoService.listarEnderecos(clienteId));
    }
}