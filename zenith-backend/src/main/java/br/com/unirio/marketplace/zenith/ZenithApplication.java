package br.com.unirio.marketplace.zenith;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ZenithApplication {

	public static void main(String[] args) {
		SpringApplication.run(ZenithApplication.class, args);
	}
}