package com.example.entity;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class Orders {

    private Integer id;
    private String orderNo;
    private BigDecimal total;
    private Integer userId;
    private String userName;
    private String status;
    private String time;
    private String deliverType;
    private String address;
    private String deliver;
    private List<Cart> cartList;
    private List<OrderDetail> orderDetailList;
    private String goodsName;
}

