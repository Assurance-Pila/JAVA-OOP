package com.example.staffmanagementsystem.controller;

import com.jfoenix.controls.JFXDrawer;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;
import java.util.HashMap;
import java.util.Map;

public class DashboardController {
    @FXML
    private Label welcomeLabel;

    @FXML
    private Label roleLabel;

    @FXML
    private JFXDrawer drawer;

    @FXML
    private VBox contentArea;

    @FXML
    private Button toggleDrawerButton;

    private boolean isDrawerOpen = true;

    private static final Map<String, String> attendanceRecords = new HashMap<>();
    private static final Map<String, String> reports = new HashMap<>();
    private static final Map<String, String> payrollRecords = new HashMap<>();

    static {
        attendanceRecords.put("jdoe", "Not marked");
        reports.put("jdoe", "No report uploaded");
        payrollRecords.put("jdoe", "$5000 for May 2025");
    }

    @FXML
    public void initialize() {
        String username = UserSession.getLoggedInUsername();
        if (username != null) {
            welcomeLabel.setText("Welcome, " + username + "!");
            var users = LoginController.getUsers();
            if (users != null) {
                var currentUser = users.stream()
                        .filter(user -> user.getUsername().equals(username))
                        .findFirst()
                        .orElse(null);
                if (currentUser != null) {
                    roleLabel.setText(currentUser.getRole());
                }
            }
        }

        displayFeature("View Schedule");
    }

    @FXML
    private void toggleDrawer(ActionEvent event) {
        isDrawerOpen = !isDrawerOpen;
        drawer.setPrefWidth(isDrawerOpen ? 250 : 0);
        toggleDrawerButton.setText(isDrawerOpen ? "☰" : "☰");
    }

    public void displayFeature(String feature) {
        contentArea.getChildren().clear();
        String username = UserSession.getLoggedInUsername();
        VBox featureBox = new VBox(10);
        featureBox.setStyle("-fx-background-color: white; -fx-padding: 15px; -fx-border-color: #ecf0f1; -fx-border-radius: 5px;");

        switch (feature) {
            case "View Schedule":
                featureBox.getChildren().add(new Label("Schedule: Meeting at 10:00 AM, May 29, 2025") {{
                    setStyle("-fx-font-size: 14px; -fx-text-fill: #2c3e50;");
                }});
                break;
            case "Mark Attendance":
                String attendance = attendanceRecords.getOrDefault(username, "Not marked");
                featureBox.getChildren().addAll(
                    new Label("Attendance Status: " + attendance) {{
                        setStyle("-fx-font-size: 14px; -fx-text-fill: #2c3e50;");
                    }},
                    new Button("Mark Attendance") {{
                        setStyle("-fx-background-color: #2ecc71; -fx-text-fill: white; -fx-padding: 5px 10px; -fx-cursor: hand;");
                        setOnAction(e -> {
                            attendanceRecords.put(username, "Marked on " + java.time.LocalDate.now());
                            displayFeature("Mark Attendance");
                        });
                    }}
                );
                break;
            case "Upload Report":
                featureBox.getChildren().addAll(
                    new TextArea() {{ setPromptText("Enter report details"); setPrefWidth(300); setPrefHeight(100); }},
                    new Button("Upload Report") {{
                        setStyle("-fx-background-color: #e74c3c; -fx-text-fill: white; -fx-padding: 5px 10px; -fx-cursor: hand;");
                        setOnAction(e -> {
                            reports.put(username, "Report uploaded on " + java.time.LocalDate.now());
                            displayFeature("Upload Report");
                        });
                    }}
                );
                break;
            case "View Payroll":
                String payroll = payrollRecords.getOrDefault(username, "No payroll data");
                featureBox.getChildren().add(new Label("Payroll: " + payroll) {{
                    setStyle("-fx-font-size: 14px; -fx-text-fill: #2c3e50;");
                }});
                break;
        }
        contentArea.getChildren().add(featureBox);
    }

    @FXML
    public void showViewSchedule() {
        displayFeature("View Schedule");
    }

    @FXML
    public void showMarkAttendance() {
        displayFeature("Mark Attendance");
    }

    @FXML
    public void showUploadReport() {
        displayFeature("Upload Report");
    }

    @FXML
    public void showViewPayroll() {
        displayFeature("View Payroll");
    }

    @FXML
    public void handleLogout(ActionEvent event) {
        try {
            UserSession.clearSession();
            Parent loginRoot = FXMLLoader.load(getClass().getResource("/login.fxml"));
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(new Scene(loginRoot));
            stage.setTitle("Staff Management System - Login");
            System.out.println("Logout successful, navigated to login screen");
        } catch (Exception e) {
            System.err.println("Failed to load login screen: " + e.getMessage());
            e.printStackTrace();
        }
    }
}