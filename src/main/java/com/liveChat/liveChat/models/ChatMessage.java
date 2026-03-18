package com.liveChat.liveChat.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    private String content;
    private String sender;

    // I could also have used @NoArgsContructor from lombok, but I forgot
    public ChatMessage() {

    }
}
