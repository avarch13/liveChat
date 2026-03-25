package com.liveChat.liveChat.models;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class ChatMessage {

    private String content;
    private String user;
    private Date timestamp;

}
