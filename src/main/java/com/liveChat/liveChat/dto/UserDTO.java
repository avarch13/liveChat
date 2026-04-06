package com.liveChat.liveChat.dto;

import java.util.UUID;

public record UserDTO(UUID id, String username, String password, String emailString) {

}
