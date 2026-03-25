package com.liveChat.liveChat.controller;

import com.liveChat.liveChat.models.ChatMessage;
import java.util.Date;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/chat")
    @SendTo("/topic/messages") // send the message to all clients sub to topic/public via broker
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        message.setTimestamp(new Date());
        //spring auto converts json to object (ChatMessage) so I don't need to manually parse
        return message;
    }


}
