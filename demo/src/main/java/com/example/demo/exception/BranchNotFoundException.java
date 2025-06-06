package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BranchNotFoundException extends RuntimeException {
    public BranchNotFoundException(Long id) {
        super(ErrorMessages.BRANCH_NOT_FOUND.getMessage() + id);
    }
}
