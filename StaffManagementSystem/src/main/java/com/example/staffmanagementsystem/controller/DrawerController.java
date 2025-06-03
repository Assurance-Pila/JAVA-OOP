package com.example.staffmanagementsystem.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;

public class DrawerController {
    private DashboardController dashboardController;

    // Method to set the parent controller
    public void setDashboardController(DashboardController dashboardController) {
        this.dashboardController = dashboardController;
    }

    @FXML
    public void showViewSchedule() {
        dashboardController.showViewSchedule();
    }

    @FXML
    public void showMarkAttendance() {
        dashboardController.showMarkAttendance();
    }

    @FXML
    public void showUploadReport() {
        dashboardController.showUploadReport();
    }

    @FXML
    public void showViewPayroll() {
        dashboardController.showViewPayroll();
    }

    @FXML
    public void handleLogout(ActionEvent event) {
        dashboardController.handleLogout(event);
    }
}