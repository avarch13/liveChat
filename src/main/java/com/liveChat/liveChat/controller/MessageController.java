package com.liveChat.liveChat.controller;

import com.liveChat.liveChat.models.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public") // send the message to all clients sub to topic/public via broker
    public ChatMessage sendMessage(ChatMessage message) {
        //spring auto converts json to object (ChatMessage) so I don't need to manually parse
        return message;
    }


}
