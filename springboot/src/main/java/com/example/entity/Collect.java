package com.example.entity;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Collect {

    private Integer id;
    private Integer goodsId;
    private String goodsName;
    private String goodsImg;
    private BigDecimal goodsPrice;
    private Integer userId;
    private String userName;
    private String time;
}

