package com.example.demo.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MemberNotFoundException extends RuntimeException {

    public MemberNotFoundException(Long memberId) {
        super(ErrorMessages.MEMBER_NOT_FOUND.getMessage() + memberId);
    }
}
