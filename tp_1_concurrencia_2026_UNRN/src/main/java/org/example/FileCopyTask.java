package org.example;

import java.io.IOException;
import java.nio.file.*;
import java.util.concurrent.atomic.AtomicBoolean;

public class FileCopyTask implements Runnable {
    private final Path origen;
    private final Path destino;

    // Para imprimir un solo espacio de separación entre bloques
    private static final AtomicBoolean separador = new AtomicBoolean(false);

    public FileCopyTask(Path origen, Path destino) {
        this.origen = origen;
        this.destino = destino;
    }

    @Override
    public void run() {
        long id = Thread.currentThread().threadId();
        String nombre = origen.getFileName().toString();

        try {
            // Alineamos el ID a 3 espacios y el nombre se imprime normal
            System.out.printf("  [INICIO]  ID: %-3d | Archivo: %s%n", id, nombre);

            long inicio = System.currentTimeMillis();
            Files.copy(origen, destino, StandardCopyOption.REPLACE_EXISTING);
            long duracion = System.currentTimeMillis() - inicio;

            // Pone un salto de línea solo una vez cuando el primer hilo termina
            if (separador.compareAndSet(false, true)) {
                System.out.println();
            }

            System.out.printf("  [EXITO ]  ID: %-3d | Tiempo: %3d ms | Archivo: %s%n", id, duracion, nombre);

        } catch (IOException e) {
            System.err.printf("  [ERROR ]  ID: %-3d | Archivo: %s | Detalle: %s%n", id, nombre, e.getMessage());
        }
    }
}
