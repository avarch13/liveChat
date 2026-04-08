package com.liveChat.liveChat.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.liveChat.liveChat.models.UserEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public UserEntity getUser(@RequestParam String param) {
        return new UserEntity();
    }
    

}
