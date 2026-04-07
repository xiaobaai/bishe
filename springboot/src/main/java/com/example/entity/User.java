package com.example.entity;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class User extends Account {
    private Integer id;
    private String username;
    private String password;
    private String name;
    private String avatar;
    private String role;
    private BigDecimal account;
}

