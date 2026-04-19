package com.example.demo;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
@Log4j2
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void printConsoleLinks() {
		log.info("----------------------------------------------------------");
		log.info("🚀 Aplicación 'Concurrencia' lista!");
		log.info("📖 Swagger UI: http://localhost:8080/swagger-ui.html");
		log.info("📊 H2 Console: http://localhost:8080/h2-console");
		log.info("----------------------------------------------------------");
	}
}
