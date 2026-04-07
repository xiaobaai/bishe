package com.example.entity;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Goods {

    private Integer id;
    private String name;
    private String img;
    private BigDecimal price;
    private String description;
    private String content;
    private Integer store;
    private Integer categoryId;
    private String categoryName;
    private String status;
    private Integer views;
    private Integer saleCount;
    private String time;
    private String recommend;
}

