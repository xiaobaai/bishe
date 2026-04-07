package com.example.entity;

import lombok.Data;

@Data
public class Admin extends Account {

    private Integer id;
    private String username;
    private String password;
    private String name;
    private String avatar;
    private String role;
}

