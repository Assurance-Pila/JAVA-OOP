package com.example.staffmanagementsystem.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class LoginController {
    @FXML
    private TextField usernameField;

    @FXML
    private PasswordField passwordField;

    @FXML
    private ComboBox<String> roleComboBox;

    @FXML
    private Label errorLabel;

    private static List<User> users = new ArrayList<>();

    static {
        users.clear();
        System.out.println("Static initializer: Initial users list size = " + users.size());
    }

    public static class User {
        private String username;
        private String password;
        private String role;

        public User(String username, String password, String role) {
            this.username = username;
            this.password = password;
            this.role = role;
        }

        public String getUsername() { return username; }
        public String getPassword() { return password; }
        public String getRole() { return role; }
    }

    @FXML
    public void initialize() {
        roleComboBox.getItems().addAll("Staff", "Manager");
        roleComboBox.getSelectionModel().selectFirst();
        System.out.println("Initialize: Users list size = " + users.size());
    }

    public static List<User> getUsers() {
        return users;
    }

    private void showAlert(String title, String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    @FXML
    private void handleLogin(ActionEvent event) {
        String username = usernameField.getText();
        String password = passwordField.getText();
        System.out.println("Login attempt: Username = " + username + ", Password = " + password);

        User user = users.stream()
                .filter(u -> u.getUsername().equals(username) && u.getPassword().equals(password))
                .findFirst()
                .orElse(null);

        if (user != null) {
            UserSession.setLoggedInUsername(username);
            try {
                System.out.println("Loading dashboard.fxml: " + getClass().getResource("/dashboard.fxml"));
                Parent root = FXMLLoader.load(getClass().getResource("/dashboard.fxml"));
                Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
                stage.setScene(new Scene(root));
                stage.setTitle("Staff Management System - Dashboard");
                System.out.println("Login successful, navigating to dashboard");
            } catch (IOException e) {
                System.err.println("Login error: " + e.getMessage());
                e.printStackTrace();
                showAlert("Login Error", "Error loading dashboard: " + e.getMessage());
            }
        } else {
            showAlert("Login Failed", "Invalid username or password.");
        }
    }

    @FXML
    private void handleSignUp(ActionEvent event) {
        String username = usernameField.getText();
        String password = passwordField.getText();
        String role = roleComboBox.getValue();
        System.out.println("Signup attempt: Username = " + username + ", Password = " + password + ", Role = " + role);

        if (username.isEmpty() || password.isEmpty() || role == null) {
            showAlert("Error", "All fields are required.");
            return;
        }

        if (users.stream().anyMatch(user -> user.getUsername().equals(username))) {
            showAlert("Error", "Username already exists.");
            return;
        }

        users.add(new User(username, password, role));
        System.out.println("Username exists check: " + users.stream().anyMatch(user -> user.getUsername().equals(username)) + ", Users list size = " + users.size());
        System.out.println("User added: " + username + ", New users list size = " + users.size());

        try {
            System.out.println("Loading dashboard.fxml: " + getClass().getResource("/dashboard.fxml"));
            Parent root = FXMLLoader.load(getClass().getResource("/dashboard.fxml"));
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(new Scene(root));
            stage.setTitle("Staff Management System - Dashboard");
            UserSession.setLoggedInUsername(username);
            System.out.println("Signup successful, navigating to dashboard");
        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            e.printStackTrace();
            showAlert("Signup Error", "Error during signup: " + e.getMessage());
        }
    }
}