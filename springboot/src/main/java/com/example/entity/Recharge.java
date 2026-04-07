package com.example.entity;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Recharge {

    private Integer id;
    private BigDecimal money;
    private Integer userId;
    private String userName;
    private String type;
    private String time;
}

