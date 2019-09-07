package com.<%-app.authorName%>.<%-app.name%>.core.usecase.validator

import com.<%-app.authorName%>.<%-app.name%>.core.domain.User
import com.<%-app.authorName%>.<%-app.name%>.core.usecase.exception.UserValidationException

object UserValidator {
    fun validateCreatedUser(user: User) {
        if (user.email.isBlank()) throw UserValidationException("Email should not be blank")
        if (user.firstName.isBlank()) throw UserValidationException("First name should not be blank")
        if (user.lastName.isBlank()) throw UserValidationException("Last name should not be blank")
    }
}

