package br.com.unirio.marketplace.zenith.config;

import br.com.unirio.marketplace.zenith.model.Usuario;
import br.com.unirio.marketplace.zenith.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@EnableTransactionManagement
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional 
    public void run(String... args) throws Exception {
        if (usuarioRepository.findByEmail("admin@gmail.com").isEmpty()) {
            
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail("admin@gmail.com");
            admin.setSenhaHash(passwordEncoder.encode("admin"));
            admin.setTipoUsuario("ADMIN");
            
            usuarioRepository.save(admin);
            
            System.out.println("---------------------------------------------");
            System.out.println("ADMINISTRADOR CRIADO COM SUCESSO");
            System.out.println("Email: admin@gmail.com");
            System.out.println("Senha: admin");
            System.out.println("---------------------------------------------");
        }
    }
}