package com.example.entity;

import lombok.Data;

@Data
public class Comment {

    private Integer id;
    private Double score;
    private String content;
    private Integer userId;
    private String userName;
    private String userAvatar;
    private String time;
    private Integer orderId;
    private String orderNo;
    private Integer goodsId;
    private String goodsName;
    private String goodsImg;
}

