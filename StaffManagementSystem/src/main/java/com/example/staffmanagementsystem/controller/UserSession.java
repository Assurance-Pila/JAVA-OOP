package com.example.staffmanagementsystem.controller;

public class UserSession {
    private static String loggedInUsername;

    public static void setLoggedInUsername(String username) {
        loggedInUsername = username;
    }

    public static String getLoggedInUsername() {
        return loggedInUsername;
    }

    public static void clearSession() {
        loggedInUsername = null;
    }
}