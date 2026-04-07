package com.example.entity;

import lombok.Data;

@Data
public class Account {
    private Integer id;
    private String username;
    private String name;
    private String password;
    private String role;
    private String newPassword;
    private String avatar;
}

