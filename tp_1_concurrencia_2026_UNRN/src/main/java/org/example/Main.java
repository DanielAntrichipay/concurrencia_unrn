package org.example;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Path origen = Paths.get("carpeta_generica");
        Path destino = Paths.get("backup");

        System.out.println("\n--- INICIO DE BACKUP CONCURRENTE ---");
        long tiempoInicioTotal = System.currentTimeMillis();

        List<Thread> ListaDeHilos = new ArrayList<>();
        List<Path> listaDePathsDeArchivos =  Files.list(origen).toList();

        for (Path pathArchivo : listaDePathsDeArchivos) {
            Thread hilo = new Thread(new FileCopyTask(pathArchivo, destino.resolve(pathArchivo.getFileName())));
            hilo.start();
            ListaDeHilos.add(hilo);
        }

        // Bucle de sincronización para esperar que todos terminen
        for (Thread hilo : ListaDeHilos) {
            try { 
                hilo.join(); 
            } catch (InterruptedException ignored) {}
        }

        long tiempoTranscurrido = System.currentTimeMillis() - tiempoInicioTotal;
        System.out.println("--- PROCESO FINALIZADO ---");
        System.out.printf("   Archivos: %d | Tiempo Total: %d ms%n\n", ListaDeHilos.size(), tiempoTranscurrido);
    }
}
