package com.example.staffmanagementsystem;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class Main extends Application {

    @Override
    public void start(Stage primaryStage) throws Exception {
        // Load the login screen as the initial view
        Parent root = FXMLLoader.load(getClass().getResource("/login.fxml"));
        primaryStage.setTitle("Staff Management System - Login");
        primaryStage.setScene(new Scene(root));
        primaryStage.show();
        System.out.println("Application started successfully");
    }

    public static void main(String[] args) {
        launch(args);
    }
}