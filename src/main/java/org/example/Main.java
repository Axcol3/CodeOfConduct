package org.example;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try {
            // Путь к файлу welcome.html (относительный или абсолютный)
            File htmlFile = new File("src/main/java/org/example/public/welcome.html");

            // Проверяем, поддерживается ли Desktop
            if (Desktop.isDesktopSupported()) {
                Desktop.getDesktop().browse(htmlFile.toURI());
                System.out.println("Opening welcome.html in your default browser...");
            } else {
                System.out.println("Desktop not supported. Open the HTML file manually.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
