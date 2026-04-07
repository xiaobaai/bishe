package com.example.entity;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class OrderDetail {

    private Integer id;
    private Integer goodsId;
    private Integer num;
    private Integer orderId;
    private String goodsImg;
    private String goodsName;
    private BigDecimal goodsPrice;
}

